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
import { defineArrayVariables } from '../../scripts/array/variables.js'

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
     * Step 3: Define the code to validate the field is an array
     */
    this.#buffer.writeStatement(
      defineArrayVariables({
        variableName: this.field.variableName,
      })
    )

    /**
     * Step 4: Execute tuple (aka array) validations
     */
    this.#buffer.writeStatement(
      defineFieldValidations({
        variableName: this.field.variableName,
        validations: this.#node.validations,
        bail: this.#node.bail,
        dropMissingCheck: false,
        existenceCheckExpression: `${this.field.variableName}.isValidDataType`,
      })
    )

    /**
     * Step 5: If value is an array and array is valid, then
     * we must validate the children and write the output
     */
    const isArrayValidBlock = defineArrayGuard({
      variableName: this.field.variableName,
      guardedCodeSnippet: `${this.#buffer.newLine}${defineIsValidGuard({
        variableName: this.field.variableName,
        bail: this.#node.bail,
        guardedCodeSnippet: `${defineArrayInitialOutput({
          variableName: this.field.variableName,
          outputExpression: this.field.outputExpression,
          outputValueExpression: this.#node.allowUnknownProperties
            ? `copyProperties(${this.field.variableName}.value)`
            : `[]`,
        })}${this.#buffer.newLine}${this.#compileTupleChildren()}`,
      })}`,
    })

    /**
     * Step 6: Define `if value is an array + valid` block
     * `else if value is null` block.
     */
    this.#buffer.writeStatement(
      `${isArrayValidBlock}${this.#buffer.newLine}${defineFieldNullOutput({
        allowNull: this.#node.allowNull,
        outputExpression: this.field.outputExpression,
        variableName: this.field.variableName,
        conditional: 'else if',
      })}`
    )
  }
}
