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
import { defineArrayGuard } from '../../scripts/array/guard.js'
import { defineIsValidGuard } from '../../scripts/field/is_valid_guard.js'
import { defineFieldNullOutput } from '../../scripts/field/null_output.js'
import { defineFieldValidations } from '../../scripts/field/validations.js'
import type { CompilerField, CompilerParent, TupleNode } from '../../types.js'
import { defineArrayInitialOutput } from '../../scripts/array/initial_output.js'
import { defineFieldExistenceValidations } from '../../scripts/field/existence_validations.js'

/**
 * Compiles a tuple schema node to JS string output.
 */
export class TupleNodeCompiler extends BaseNode {
  #node: TupleNode
  #buffer: CompilerBuffer
  #compiler: Compiler

  constructor(
    node: TupleNode,
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
   * Compiles the tuple children to a JS fragment
   */
  #compileTupleChildren() {
    const buffer = this.#buffer.child()
    const parent = {
      type: 'tuple',
      fieldPathExpression: this.field.fieldPathExpression,
      outputExpression: this.field.outputExpression,
      variableName: this.field.variableName,
      wildCardPath: this.field.wildCardPath,
    } as const

    this.#node.properties.forEach((child) => {
      this.#compiler.compileNode(child, buffer, parent)
    })

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
     * Wrapping initialization of output + tuple validation
     * validation inside `if array field is valid` block.
     *
     * Pre step: 3
     */
    const isArrayValidBlock = defineIsValidGuard({
      variableName: this.field.variableName,
      bail: this.#node.bail,
      guardedCodeSnippet: `${defineArrayInitialOutput({
        variableName: this.field.variableName,
        outputExpression: this.field.outputExpression,
        outputValueExpression: this.#node.allowUnknownProperties
          ? `copyProperties(${this.field.variableName}.value)`
          : `[]`,
      })}${this.#compileTupleChildren()}`,
    })

    /**
     * Wrapping field validations + "isArrayValidBlock" inside
     * `if value is array` check.
     *
     * Pre step: 3
     */
    const isValueAnArrayBlock = defineArrayGuard({
      variableName: this.field.variableName,
      guardedCodeSnippet: `${defineFieldValidations({
        variableName: this.field.variableName,
        validations: this.#node.validations,
        bail: this.#node.bail,
        dropMissingCheck: true,
      })}${this.#buffer.newLine}${isArrayValidBlock}`,
    })

    /**
     * Step 3: Define `if value is an array` block and `else if value is null`
     * block.
     */
    this.#buffer.writeStatement(
      `${isValueAnArrayBlock}${this.#buffer.newLine}${defineFieldNullOutput({
        allowNull: this.#node.allowNull,
        outputExpression: this.field.outputExpression,
        variableName: this.field.variableName,
        conditional: 'else if',
      })}`
    )
  }
}
