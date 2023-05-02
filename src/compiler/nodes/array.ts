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
import { defineArrayLoop } from '../../scripts/array/loop.js'
import { defineArrayGuard } from '../../scripts/array/guard.js'
import { defineIsValidGuard } from '../../scripts/field/is_valid_guard.js'
import { defineFieldNullOutput } from '../../scripts/field/null_output.js'
import { defineFieldValidations } from '../../scripts/field/validations.js'
import type { CompilerField, CompilerParent, ArrayNode } from '../../types.js'
import { defineArrayInitialOutput } from '../../scripts/array/initial_output.js'
import { defineFieldExistenceValidations } from '../../scripts/field/existence_validations.js'

/**
 * Compiles an array schema node to JS string output.
 */
export class ArrayNodeCompiler extends BaseNode {
  #node: ArrayNode
  #buffer: CompilerBuffer
  #compiler: Compiler

  constructor(
    node: ArrayNode,
    buffer: CompilerBuffer,
    compiler: Compiler,
    parent?: CompilerParent,
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
    if (this.#node.children) {
      const buffer = this.#buffer.child()

      this.#node.children.forEach((child) => {
        this.#compiler.compileNode(child, buffer, {
          type: 'tuple',
          fieldPathExpression: this.field.fieldPathExpression,
          outputExpression: this.field.outputExpression,
          variableName: this.field.variableName,
        })
      })

      return buffer.toString()
    }

    return ''
  }

  /**
   * Compiles the array elements to a JS fragment
   */
  #compileArrayElements() {
    if (this.#node.each) {
      const buffer = this.#buffer.child()
      const arrayElementsBuffer = this.#buffer.child()

      this.#compiler.compileNode(this.#node.each, arrayElementsBuffer, {
        type: 'array',
        fieldPathExpression: this.field.fieldPathExpression,
        outputExpression: this.field.outputExpression,
        variableName: this.field.variableName,
      })

      buffer.writeStatement(
        defineArrayLoop({
          variableName: this.field.variableName,
          startingIndex: this.#node.children?.length || 0,
          loopCodeSnippet: arrayElementsBuffer.toString(),
        })
      )

      arrayElementsBuffer.flush()
      return buffer.toString()
    }

    return ''
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
    const isArrayValidBlock = defineIsValidGuard({
      variableName: this.field.variableName,
      bail: this.#node.bail,
      guardedCodeSnippet: `${defineArrayInitialOutput({
        outputExpression: this.field.outputExpression,
        outputValueExpression: this.#node.allowUnknownProperties
          ? `copyProperties(${this.field.variableName}.value)`
          : `[]`,
      })}${this.#compileTupleChildren()}${this.#buffer.newLine}${this.#compileArrayElements()}`,
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
