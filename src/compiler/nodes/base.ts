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
import type { CompilerField, CompilerNodes, CompilerParent } from '../../types.js'
import { defineFieldVariables } from '../../scripts/field/variables.js'

export abstract class BaseNode {
  #parentField?: CompilerField
  protected field: CompilerField

  constructor(
    node: CompilerNodes,
    compiler: Compiler,
    parent: CompilerParent,
    parentField?: CompilerField
  ) {
    this.#parentField = parentField

    if (this.#parentField) {
      this.field = this.#parentField
    } else {
      compiler.variablesCounter++
      this.field = compiler.createFieldFor(node, parent)
    }
  }

  protected defineField(buffer: CompilerBuffer) {
    if (!this.#parentField) {
      buffer.writeStatement(defineFieldVariables(this.field))
    }
  }
}
