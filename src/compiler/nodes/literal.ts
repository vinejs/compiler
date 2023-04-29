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
import { defineFieldVariables } from '../../scripts/field/variables.js'
import type { CompilerLiteralNode, CompilerParent, CompilerUnionParent } from '../../types.js'
import { defineFieldValidations } from '../../scripts/field/validations.js'
import { defineFieldNullOutput } from '../../scripts/field/null_output.js'
import { defineFieldValueOutput } from '../../scripts/field/value_output.js'
import { defineFieldExistenceValidations } from '../../scripts/field/existence_validations.js'

/**
 * Compiles a literal schema node to JS string output.
 */
export class LiteralNodeCompiler {
  #node: CompilerLiteralNode
  #buffer: CompilerBuffer
  #compiler: Compiler
  #parent?: CompilerParent
  #union?: CompilerUnionParent

  constructor(
    node: CompilerLiteralNode,
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
     * Step 2: Define block to validate the existence of field
     */
    this.#buffer.writeStatement(
      defineFieldExistenceValidations({
        allowNull: this.#node.allowNull,
        isOptional: this.#node.isOptional,
        variableName: field.variableName,
      })
    )

    /**
     * Step 3: Define code to run validations on field
     */
    this.#buffer.writeStatement(
      defineFieldValidations({
        variableName: field.variableName,
        validations: this.#node.validations,
        bail: this.#node.bail,
        dropMissingCheck: false,
      })
    )

    /**
     * Step 4: Define block to save the output value or the null value
     */
    this.#buffer.writeStatement(
      `${defineFieldValueOutput({
        variableName: field.variableName,
        outputExpression: field.outputExpression,
        transformFnRefId: this.#node.transformFnId,
      })}${EOL}${defineFieldNullOutput({
        variableName: field.variableName,
        allowNull: this.#node.allowNull,
        outputExpression: field.outputExpression,
        transformFnRefId: this.#node.transformFnId,
        conditional: 'else if',
      })}`
    )
  }
}
