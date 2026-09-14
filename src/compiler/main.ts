/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CompilerBuffer } from './buffer.js'
import { TupleNodeCompiler } from './nodes/tuple.js'
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
  RootNode,
  CompilerField,
  CompilerNodes,
  CompilerParent,
  CompilerOptions,
  CompiledValidator,
  CompiledSyncValidator,
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
   * Options to configure the compiler behavior
   */
  #options: CompilerOptions

  /**
   * Buffer for collection the JS output string
   */
  #buffer: CompilerBuffer = new CompilerBuffer()

  /**
   * Whether the current compilation targets a synchronous function
   */
  #synchronous: boolean = false

  constructor(rootNode: RootNode, options?: CompilerOptions) {
    this.#rootNode = rootNode
    this.#options = options || { convertEmptyStringsToNull: false }
  }

  /**
   * Initiates the JS output
   */
  #initiateJSOutput() {
    this.#buffer.writeStatement(
      defineInlineErrorMessages({
        required: 'value is required',
        object: 'value is not a valid object',
        array: 'value is not a valid array',
        ...this.#options.messages,
      })
    )
    this.#buffer.writeStatement(defineInlineFunctions(this.#options, this.#synchronous))
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
      wildCardPath: '',
    })
  }

  /**
   * Returns compiled output as a function
   */
  #toAsyncFunction(): CompiledValidator {
    return new AsyncFunction(
      'root',
      'meta',
      'refs',
      'messagesProvider',
      'errorReporter',
      this.#buffer.toString()
    )
  }

  /**
   * Returns compiled output as a synchronous function
   */
  #toFunction(): CompiledSyncValidator {
    return new Function(
      'root',
      'meta',
      'refs',
      'messagesProvider',
      'errorReporter',
      this.#buffer.toString()
    ) as CompiledSyncValidator
  }

  /**
   * Ensures async validation rules are not part of synchronous compilation
   */
  #ensureCanCompileSync(node: CompilerNodes) {
    if (!this.#synchronous || !('validations' in node)) {
      return
    }

    const asyncRule = node.validations.find((validation) => validation.isAsync)
    if (asyncRule) {
      throw new Error(
        `Cannot compile validation rule "${asyncRule.name || asyncRule.ruleFnId}" for field "${node.fieldName}" synchronously because it is async`
      )
    }
  }

  /**
   * Converts a node to a field. Optionally accepts a parent node to create
   * a field for a specific parent type.
   */
  createFieldFor(node: CompilerNodes, parent: CompilerParent) {
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
    parent: CompilerParent,
    parentField?: CompilerField
  ) {
    this.#ensureCanCompileSync(node)

    switch (node.type) {
      case 'literal':
        return new LiteralNodeCompiler(
          node,
          buffer,
          this,
          parent,
          parentField,
          this.#synchronous
        ).compile()
      case 'array':
        return new ArrayNodeCompiler(
          node,
          buffer,
          this,
          parent,
          parentField,
          this.#synchronous
        ).compile()
      case 'record':
        return new RecordNodeCompiler(
          node,
          buffer,
          this,
          parent,
          parentField,
          this.#synchronous
        ).compile()
      case 'object':
        return new ObjectNodeCompiler(
          node,
          buffer,
          this,
          parent,
          parentField,
          this.#synchronous
        ).compile()
      case 'tuple':
        return new TupleNodeCompiler(
          node,
          buffer,
          this,
          parent,
          parentField,
          this.#synchronous
        ).compile()
      case 'union':
        return new UnionNodeCompiler(node, buffer, this, parent, parentField).compile()
    }
  }

  /**
   * Compile schema nodes to an async function
   */
  compile(): CompiledValidator {
    return this.#compile(false)
  }

  /**
   * Compile schema nodes to a synchronous function
   */
  compileSync(): CompiledSyncValidator {
    return this.#compile(true)
  }

  /**
   * Compile schema nodes to a function using the requested execution mode
   */
  #compile(synchronous: false): CompiledValidator
  #compile(synchronous: true): CompiledSyncValidator
  #compile(synchronous: boolean) {
    this.#synchronous = synchronous
    this.#initiateJSOutput()

    try {
      this.#compileNodes()
      this.#finishJSOutput()

      return synchronous ? this.#toFunction() : this.#toAsyncFunction()
    } finally {
      this.#synchronous = false
      this.variablesCounter = 0
      this.#buffer.flush()
    }
  }
}
