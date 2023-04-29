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
import { defineArrayLoop } from '../../scripts/array/loop.js'
import { defineArrayGuard } from '../../scripts/array/guard.js'
import { defineFieldVariables } from '../../scripts/field/variables.js'
import { defineIsValidGuard } from '../../scripts/field/is_valid_guard.js'
import { defineFieldNullOutput } from '../../scripts/field/null_output.js'
import { defineFieldValidations } from '../../scripts/field/validations.js'
import { defineArrayInitialOutput } from '../../scripts/array/initial_output.js'
import { defineFieldExistenceValidations } from '../../scripts/field/existence_validations.js'
import type {
  CompilerField,
  CompilerParent,
  CompilerArrayNode,
  CompilerUnionParent,
} from '../../types.js'

/**
 * Compiles an array schema node to JS string output.
 */
export class ArrayNodeCompiler {
  #node: CompilerArrayNode
  #buffer: CompilerBuffer
  #compiler: Compiler
  #parent?: CompilerParent
  #union?: CompilerUnionParent

  constructor(
    node: CompilerArrayNode,
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
   * Compiles the tuple children to a JS fragment
   */
  #compileTupleChildren(field: CompilerField) {
    if (this.#node.children) {
      const buffer = this.#buffer.child()

      this.#node.children.forEach((child) => {
        this.#compiler.compileNode(child, buffer, {
          type: 'tuple',
          fieldPathExpression: field.fieldPathExpression,
          outputExpression: field.outputExpression,
          variableName: field.variableName,
        })
      })

      return buffer.toString()
    }

    return ''
  }

  /**
   * Compiles the array elements to a JS fragment
   */
  #compileArrayElements(field: CompilerField) {
    if (this.#node.each) {
      const buffer = this.#buffer.child()
      const arrayElementsBuffer = this.#buffer.child()

      this.#compiler.compileNode(this.#node.each, arrayElementsBuffer, {
        type: 'array',
        fieldPathExpression: field.fieldPathExpression,
        outputExpression: field.outputExpression,
        variableName: field.variableName,
      })

      buffer.writeStatement(
        defineArrayLoop({
          variableName: field.variableName,
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
    const isArrayValidBlock = defineIsValidGuard({
      variableName: field.variableName,
      bail: this.#node.bail,
      guardedCodeSnippet: `${defineArrayInitialOutput({
        outputExpression: field.outputExpression,
        outputValueExpression: this.#node.allowUnknownProperties
          ? `copyProperties(${field.variableName}.value)`
          : `[]`,
      })}${this.#compileTupleChildren(field)}${EOL}${this.#compileArrayElements(field)}`,
    })

    /**
     * Wrapping field validations + "isArrayValidBlock" inside
     * `if value is array` check.
     *
     * Pre step: 3
     */
    const isValueAnArrayBlock = defineArrayGuard({
      variableName: field.variableName,
      guardedCodeSnippet: `${defineFieldValidations({
        variableName: field.variableName,
        validations: this.#node.validations,
        bail: this.#node.bail,
        dropMissingCheck: true,
      })}${EOL}${isArrayValidBlock}`,
    })

    /**
     * Step 3: Define `if value is an array` block and `else if value is null`
     * block.
     */
    this.#buffer.writeStatement(
      `${isValueAnArrayBlock}${EOL}${defineFieldNullOutput({
        allowNull: this.#node.allowNull,
        outputExpression: field.outputExpression,
        variableName: field.variableName,
        conditional: 'else if',
      })}`
    )
  }
}
