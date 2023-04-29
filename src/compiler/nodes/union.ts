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
import { defineConditionalGuard } from '../../scripts/union/conditional_guard.js'
import type {
  CompilerField,
  CompilerParent,
  CompilerUnionNode,
  CompilerUnionParent,
} from '../../types.js'

/**
 * Compiles a union schema node to JS string output.
 */
export class UnionNodeCompiler {
  #compiler: Compiler
  #node: CompilerUnionNode
  #buffer: CompilerBuffer
  #parent?: CompilerParent
  #union?: CompilerUnionParent

  constructor(
    node: CompilerUnionNode,
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
   * Compiles union children by wrapping each conditon inside a conditional
   * guard block
   */
  #compileUnionChildren(field: CompilerField) {
    const childrenBuffer = this.#buffer.child()

    this.#node.children.forEach((child, index) => {
      const conditionalBuffer = this.#buffer.child()
      this.#compiler.compileNode(child.schema, conditionalBuffer, this.#parent, {
        variableName: field.variableName,
      })

      childrenBuffer.writeStatement(
        defineConditionalGuard({
          conditional: index === 0 ? 'if' : 'else if',
          variableName: field.variableName,
          conditionalFnRefId: child.conditionalFnRefId,
          guardedCodeSnippet: conditionalBuffer.toString(),
        })
      )

      conditionalBuffer.flush()
    })

    return childrenBuffer.toString()
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
     * Step 2: Compile union children wrapped inside predicate
     * condition.
     */
    this.#buffer.writeStatement(this.#compileUnionChildren(field))
  }
}
