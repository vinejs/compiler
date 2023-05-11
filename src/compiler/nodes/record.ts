/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseNode } from './base.js'
import type { Compiler } from '../main.js'
import type { CompilerBuffer } from '../buffer.js'
import { defineRecordLoop } from '../../scripts/record/loop.js'
import { defineObjectGuard } from '../../scripts/object/guard.js'
import { defineFieldNullOutput } from '../../scripts/field/null_output.js'
import { defineIsValidGuard } from '../../scripts/field/is_valid_guard.js'
import { defineFieldValidations } from '../../scripts/field/validations.js'
import type { CompilerField, CompilerParent, RecordNode } from '../../types.js'
import { defineObjectInitialOutput } from '../../scripts/object/initial_output.js'
import { defineFieldExistenceValidations } from '../../scripts/field/existence_validations.js'

/**
 * Compiles a record schema node to JS string output.
 */
export class RecordNodeCompiler extends BaseNode {
  #node: RecordNode
  #buffer: CompilerBuffer
  #compiler: Compiler

  constructor(
    node: RecordNode,
    buffer: CompilerBuffer,
    compiler: Compiler,
    parent: CompilerParent,
    parentField?: CompilerField
  ) {
    super(node, compiler, parent, parentField)
    this.#node = node
    this.#buffer = buffer
    this.#compiler = compiler
  }

  /**
   * Compiles the record elements to a JS fragment
   */
  #compileRecordElements() {
    const buffer = this.#buffer.child()
    const recordElementsBuffer = this.#buffer.child()

    this.#compiler.compileNode(this.#node.each, recordElementsBuffer, {
      type: 'record',
      fieldPathExpression: this.field.fieldPathExpression,
      outputExpression: this.field.outputExpression,
      variableName: this.field.variableName,
      wildCardPath: this.field.wildCardPath,
    })

    buffer.writeStatement(
      defineRecordLoop({
        variableName: this.field.variableName,
        loopCodeSnippet: recordElementsBuffer.toString(),
      })
    )

    recordElementsBuffer.flush()
    return buffer.toString()
  }

  compile() {
    /**
     * Define 1: Define field variable
     */
    this.defineField(this.#buffer)

    /**
     * Step 2: Define code to validate the existence of field.
     */
    this.#buffer.writeStatement(
      defineFieldExistenceValidations({
        allowNull: this.#node.allowNull,
        isOptional: this.#node.isOptional,
        variableName: this.field.variableName,
      })
    )

    /**
     * Wrapping initialization of output + tuple validation + array elements
     * validation inside `if array field is valid` block.
     *
     * Pre step: 3
     */
    const isObjectValidBlock = defineIsValidGuard({
      variableName: this.field.variableName,
      bail: this.#node.bail,
      guardedCodeSnippet: `${defineObjectInitialOutput({
        variableName: this.field.variableName,
        outputExpression: this.field.outputExpression,
        outputValueExpression: `{}`,
      })}${this.#compileRecordElements()}`,
    })

    /**
     * Wrapping field validations + "isArrayValidBlock" inside
     * `if value is array` check.
     *
     * Pre step: 3
     */
    const isValueAnObjectBlock = defineObjectGuard({
      variableName: this.field.variableName,
      guardedCodeSnippet: `${defineFieldValidations({
        variableName: this.field.variableName,
        validations: this.#node.validations,
        bail: this.#node.bail,
        dropMissingCheck: true,
      })}${this.#buffer.newLine}${isObjectValidBlock}`,
    })

    /**
     * Step 3: Define `if value is an object` block and `else if value is null`
     * block.
     */
    this.#buffer.writeStatement(
      `${isValueAnObjectBlock}${this.#buffer.newLine}${defineFieldNullOutput({
        allowNull: this.#node.allowNull,
        outputExpression: this.field.outputExpression,
        variableName: this.field.variableName,
        conditional: 'else if',
      })}`
    )
  }
}
