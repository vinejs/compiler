/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CompilerBuffer } from './buffer.js'
import { createField } from './fields/field.js'
import { ArrayNodeCompiler } from './nodes/array.js'
import { UnionNodeCompiler } from './nodes/union.js'
import { RecordNodeCompiler } from './nodes/record.js'
import { ObjectNodeCompiler } from './nodes/object.js'
import { createRootField } from './fields/root_field.js'
import { LiteralNodeCompiler } from './nodes/literal.js'
import { createArrayField } from './fields/array_field.js'
import { createTupleField } from './fields/tuple_field.js'
import { reportErrors } from '../scripts/report_errors.js'
import { createObjectField } from './fields/object_field.js'
import { createRecordField } from './fields/record_field.js'
import { defineInlineFunctions } from '../scripts/define_inline_functions.js'
import { defineInlineErrorMessages } from '../scripts/define_error_messages.js'
import type {
  RefIdentifier,
  CompilerNodes,
  CompilerParent,
  RootNode,
  CompilerUnionParent,
  ErrorReporterContract,
} from '../types.js'

/**
 * Representation of an async function
 */
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

/**
 * Compiler is used to compile an array of schema nodes into a re-usable
 * JavaScript.
 */
export class Compiler {
  /**
   * Variables counter is used to generate unique variable
   * names with a counter suffix.
   */
  variablesCounter: number = 0

  /**
   * An array of nodes to process
   */
  #rootNode: RootNode

  /**
   * Buffer for collection the JS output string
   */
  #buffer: CompilerBuffer = new CompilerBuffer()

  constructor(rootNode: RootNode) {
    this.#rootNode = rootNode
  }

  /**
   * Initiates the JS output
   */
  #initiateJSOutput() {
    this.#buffer.writeStatement(defineInlineErrorMessages())
    this.#buffer.writeStatement(defineInlineFunctions())
    this.#buffer.writeStatement('let out;')
  }

  /**
   * Finished the JS output
   */
  #finishJSOutput() {
    this.#buffer.writeStatement(reportErrors())
    this.#buffer.writeStatement('return out;')
  }

  /**
   * Compiles all the nodes
   */
  #compileNodes() {
    this.compileNode(this.#rootNode.schema, this.#buffer, {
      type: 'root',
      variableName: 'root',
      outputExpression: 'out',
      fieldPathExpression: 'out',
    })
  }

  /**
   * Returns compiled output as a function
   */
  #toAsyncFunction<T extends Record<string, any>>(): (
    data: any,
    meta: Record<string, any>,
    refs: Record<RefIdentifier, any>,
    errorReporter: ErrorReporterContract
  ) => Promise<T> {
    return new AsyncFunction('root', 'meta', 'refs', 'errorReporter', this.#buffer.toString())
  }

  /**
   * Converts a node to a field. Optionally accepts a parent node to create
   * a field for a specific parent type.
   */
  createFieldFor(node: CompilerNodes, parent?: CompilerParent) {
    if (!parent) {
      return createField(node, this.variablesCounter)
    }

    switch (parent.type) {
      case 'array':
        return createArrayField(parent)
      case 'root':
        return createRootField(parent)
      case 'object':
        return createObjectField(node, this.variablesCounter, parent)
      case 'tuple':
        return createTupleField(node, parent)
      case 'record':
        return createRecordField(parent)
    }
  }

  /**
   * Compiles a given compiler node
   */
  compileNode(
    node: CompilerNodes,
    buffer: CompilerBuffer,
    parent?: CompilerParent,
    union?: CompilerUnionParent
  ) {
    switch (node.type) {
      case 'literal':
        return new LiteralNodeCompiler(node, buffer, this, parent, union).compile()
      case 'object':
        return new ObjectNodeCompiler(node, buffer, this, parent, union).compile()
      case 'array':
        return new ArrayNodeCompiler(node, buffer, this, parent, union).compile()
      case 'record':
        return new RecordNodeCompiler(node, buffer, this, parent, union).compile()
      case 'union':
        return new UnionNodeCompiler(node, buffer, this, parent, union).compile()
    }
  }

  /**
   * Compile schema nodes to an async function
   */
  compile() {
    this.#initiateJSOutput()
    this.#compileNodes()
    this.#finishJSOutput()

    const outputFunction = this.#toAsyncFunction()

    this.variablesCounter = 0
    this.#buffer.flush()

    return outputFunction
  }
}
