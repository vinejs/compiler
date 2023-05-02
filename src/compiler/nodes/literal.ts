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
import { defineFieldValidations } from '../../scripts/field/validations.js'
import { defineFieldNullOutput } from '../../scripts/field/null_output.js'
import { defineFieldValueOutput } from '../../scripts/field/value_output.js'
import type { LiteralNode, CompilerParent, CompilerField } from '../../types.js'
import { defineFieldExistenceValidations } from '../../scripts/field/existence_validations.js'

/**
 * Compiles a literal schema node to JS string output.
 */
export class LiteralNodeCompiler extends BaseNode {
  #node: LiteralNode
  #buffer: CompilerBuffer

  constructor(
    node: LiteralNode,
    buffer: CompilerBuffer,
    compiler: Compiler,
    parent?: CompilerParent,
    parentField?: CompilerField
  ) {
    super(node, compiler, parent, parentField)
    this.#node = node
    this.#buffer = buffer
  }

  compile() {
    /**
     * Define 1: Define field variable
     */
    this.defineField(this.#buffer)

    /**
     * Step 2: Define block to validate the existence of field
     */
    this.#buffer.writeStatement(
      defineFieldExistenceValidations({
        allowNull: this.#node.allowNull,
        isOptional: this.#node.isOptional,
        variableName: this.field.variableName,
      })
    )

    /**
     * Step 3: Define code to run validations on field
     */
    this.#buffer.writeStatement(
      defineFieldValidations({
        variableName: this.field.variableName,
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
        variableName: this.field.variableName,
        outputExpression: this.field.outputExpression,
        transformFnRefId: this.#node.transformFnId,
      })}${this.#buffer.newLine}${defineFieldNullOutput({
        variableName: this.field.variableName,
        allowNull: this.#node.allowNull,
        outputExpression: this.field.outputExpression,
        transformFnRefId: this.#node.transformFnId,
        conditional: 'else if',
      })}`
    )
  }
}
