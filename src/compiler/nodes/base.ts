/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Compiler } from '../main.js'
import type { CompilerBuffer } from '../buffer.js'
import { defineFieldVariables } from '../../scripts/field/variables.js'
import type { CompilerField, CompilerNodes, CompilerParent } from '../../types.js'

export abstract class BaseNode {
  #node: CompilerNodes
  #parentField?: CompilerField
  protected field: CompilerField

  constructor(
    node: CompilerNodes,
    compiler: Compiler,
    parent: CompilerParent,
    parentField?: CompilerField
  ) {
    this.#parentField = parentField
    this.#node = node

    if (this.#parentField) {
      this.field = this.#parentField
    } else {
      compiler.variablesCounter++
      this.field = compiler.createFieldFor(node, parent)
    }
  }

  protected defineField(buffer: CompilerBuffer) {
    if (!this.#parentField) {
      buffer.writeStatement(
        defineFieldVariables({
          fieldNameExpression: this.field.fieldNameExpression,
          isArrayMember: this.field.isArrayMember,
          parentExpression: this.field.parentExpression,
          parentValueExpression: this.field.parentValueExpression,
          valueExpression: this.field.valueExpression,
          variableName: this.field.variableName,
          wildCardPath: this.field.wildCardPath,
          parseFnRefId: 'parseFnId' in this.#node ? this.#node.parseFnId : undefined,
        })
      )
    }
  }
}
