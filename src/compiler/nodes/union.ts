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
import { defineConditionalGuard } from '../../scripts/union/conditional_guard.js'
import type { CompilerField, CompilerParent, UnionNode } from '../../types.js'

/**
 * Compiles a union schema node to JS string output.
 */
export class UnionNodeCompiler extends BaseNode {
  #compiler: Compiler
  #node: UnionNode
  #buffer: CompilerBuffer
  #parent?: CompilerParent

  constructor(
    node: UnionNode,
    buffer: CompilerBuffer,
    compiler: Compiler,
    parent?: CompilerParent,
    parentField?: CompilerField
  ) {
    super(node, compiler, parent, parentField)
    this.#node = node
    this.#buffer = buffer
    this.#parent = parent
    this.#compiler = compiler
  }

  /**
   * Compiles union children by wrapping each conditon inside a conditional
   * guard block
   */
  #compileUnionChildren() {
    const childrenBuffer = this.#buffer.child()

    this.#node.conditions.forEach((child, index) => {
      const conditionalBuffer = this.#buffer.child()
      this.#compiler.compileNode(child.schema, conditionalBuffer, this.#parent, this.field)

      childrenBuffer.writeStatement(
        defineConditionalGuard({
          conditional: index === 0 ? 'if' : 'else if',
          variableName: this.field.variableName,
          conditionalFnRefId: child.conditionalFnRefId,
          guardedCodeSnippet: conditionalBuffer.toString(),
        })
      )

      conditionalBuffer.flush()
    })

    return childrenBuffer.toString()
  }

  compile() {
    /**
     * Define 1: Define field variable
     */
    this.defineField(this.#buffer)

    /**
     * Step 2: Compile union children wrapped inside predicate
     * condition.
     */
    this.#buffer.writeStatement(this.#compileUnionChildren())
  }
}
