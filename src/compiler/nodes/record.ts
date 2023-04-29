/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EOL } from 'node:os'
import type { Compiler } from '../main.js'
import type { CompilerBuffer } from '../buffer.js'
import { defineRecordLoop } from '../../scripts/record/loop.js'
import { defineObjectGuard } from '../../scripts/object/guard.js'
import { defineFieldVariables } from '../../scripts/field/variables.js'
import { defineFieldNullOutput } from '../../scripts/field/null_output.js'
import { defineIsValidGuard } from '../../scripts/field/is_valid_guard.js'
import { defineFieldValidations } from '../../scripts/field/validations.js'
import { defineObjectInitialOutput } from '../../scripts/object/initial_output.js'
import { defineFieldExistenceValidations } from '../../scripts/field/existence_validations.js'

import type {
  CompilerField,
  CompilerParent,
  CompilerRecordNode,
  CompilerUnionParent,
} from '../../types.js'

/**
 * Compiles a record schema node to JS string output.
 */
export class RecordNodeCompiler {
  #node: CompilerRecordNode
  #buffer: CompilerBuffer
  #compiler: Compiler
  #parent?: CompilerParent
  #union?: CompilerUnionParent

  constructor(
    node: CompilerRecordNode,
    buffer: CompilerBuffer,
    compiler: Compiler,
    parent?: CompilerParent,
    union?: CompilerUnionParent
  ) {
    this.#node = node
    this.#buffer = buffer
    this.#compiler = compiler
    this.#parent = parent
    this.#union = union
  }

  /**
   * Creates field for the current node. Handles checks needed for union
   * child.
   */
  #createField() {
    /**
     * Do not increment the variables counter when a direct
     * child of a union.
     */
    if (!this.#union) {
      this.#compiler.variablesCounter++
    }

    const field = this.#compiler.createFieldFor(this.#node, this.#parent)
    if (this.#union) {
      field.variableName = this.#union.variableName
    }

    return field
  }

  /**
   * Compiles the record elements to a JS fragment
   */
  #compileRecordElements(field: CompilerField) {
    const buffer = this.#buffer.child()
    const recordElementsBuffer = this.#buffer.child()

    this.#compiler.compileNode(this.#node.each, recordElementsBuffer, {
      type: 'record',
      fieldPathExpression: field.fieldPathExpression,
      outputExpression: field.outputExpression,
      variableName: field.variableName,
    })

    buffer.writeStatement(
      defineRecordLoop({
        variableName: field.variableName,
        loopCodeSnippet: recordElementsBuffer.toString(),
      })
    )

    recordElementsBuffer.flush()
    return buffer.toString()
  }

  compile() {
    const field = this.#createField()

    /**
     * Step 1: Define the field variable when field is not a child
     * of a union.
     */
    if (!this.#union) {
      this.#buffer.writeStatement(
        defineFieldVariables({
          variableName: field.variableName,
          valueExpression: field.valueExpression,
          fieldNameExpression: field.fieldNameExpression,
          fieldPathExpression: field.fieldPathExpression,
          parentValueExpression: field.parentVariableName,
          isArrayMember: field.isArrayMember,
        })
      )
    }

    /**
     * Step 2: Define code to validate the existence of field.
     */
    this.#buffer.writeStatement(
      defineFieldExistenceValidations({
        allowNull: this.#node.allowNull,
        isOptional: this.#node.isOptional,
        variableName: field.variableName,
      })
    )

    /**
     * Wrapping initialization of output + tuple validation + array elements
     * validation inside `if array field is valid` block.
     *
     * Pre step: 3
     */
    const isObjectValidBlock = defineIsValidGuard({
      variableName: field.variableName,
      bail: this.#node.bail,
      guardedCodeSnippet: `${defineObjectInitialOutput({
        outputExpression: field.outputExpression,
        outputValueExpression: `{}`,
      })}${this.#compileRecordElements(field)}`,
    })

    /**
     * Wrapping field validations + "isArrayValidBlock" inside
     * `if value is array` check.
     *
     * Pre step: 3
     */
    const isValueAnObjectBlock = defineObjectGuard({
      variableName: field.variableName,
      guardedCodeSnippet: `${defineFieldValidations({
        variableName: field.variableName,
        validations: this.#node.validations,
        bail: this.#node.bail,
        dropMissingCheck: true,
      })}${EOL}${isObjectValidBlock}`,
    })

    /**
     * Step 3: Define `if value is an object` block and `else if value is null`
     * block.
     */
    this.#buffer.writeStatement(
      `${isValueAnObjectBlock}${EOL}${defineFieldNullOutput({
        allowNull: this.#node.allowNull,
        outputExpression: field.outputExpression,
        variableName: field.variableName,
        conditional: 'else if',
      })}`
    )
  }
}
