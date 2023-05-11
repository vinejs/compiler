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
import { defineObjectGuard } from '../../scripts/object/guard.js'
import { defineElseCondition } from '../../scripts/define_else_conditon.js'
import { defineIsValidGuard } from '../../scripts/field/is_valid_guard.js'
import { defineFieldNullOutput } from '../../scripts/field/null_output.js'
import { defineFieldValidations } from '../../scripts/field/validations.js'
import { defineConditionalGuard } from '../../scripts/define_conditional_guard.js'
import { defineObjectInitialOutput } from '../../scripts/object/initial_output.js'
import { defineMoveProperties } from '../../scripts/object/move_unknown_properties.js'
import { defineFieldExistenceValidations } from '../../scripts/field/existence_validations.js'
import type { CompilerField, CompilerParent, ObjectNode, ObjectGroupNode } from '../../types.js'

/**
 * Compiles an object schema node to JS string output.
 */
export class ObjectNodeCompiler extends BaseNode {
  #node: ObjectNode
  #buffer: CompilerBuffer
  #compiler: Compiler

  constructor(
    node: ObjectNode,
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
   * Returns known field names for the object
   */
  #getFieldNames(node: Pick<ObjectNode, 'properties' | 'groups'>): string[] {
    let fieldNames = node.properties.map((child) => child.fieldName)
    const groupsFieldNames = node.groups.flatMap((group) => this.#getGroupFieldNames(group))
    return fieldNames.concat(groupsFieldNames)
  }

  /**
   * Returns field names of a group.
   */
  #getGroupFieldNames(group: ObjectGroupNode): string[] {
    return group.conditions.flatMap((condition) => {
      return this.#getFieldNames(condition.schema)
    })
  }

  /**
   * Compiles object children to JS output
   */
  #compileObjectChildren() {
    const buffer = this.#buffer.child()
    const parent = {
      type: 'object',
      fieldPathExpression: this.field.fieldPathExpression,
      outputExpression: this.field.outputExpression,
      variableName: this.field.variableName,
      wildCardPath: this.field.wildCardPath,
    } as const

    this.#node.properties.forEach((child) => this.#compiler.compileNode(child, buffer, parent))
    return buffer.toString()
  }

  /**
   * Compiles object groups with conditions to JS output.
   */
  #compileObjectGroups() {
    const buffer = this.#buffer.child()
    const parent = {
      type: 'object',
      fieldPathExpression: this.field.fieldPathExpression,
      outputExpression: this.field.outputExpression,
      variableName: this.field.variableName,
      wildCardPath: this.field.wildCardPath,
    } as const
    this.#node.groups.forEach((group) => this.#compileObjectGroup(group, buffer, parent))
    return buffer.toString()
  }

  /**
   * Compiles an object groups recursively
   */
  #compileObjectGroup(group: ObjectGroupNode, buffer: CompilerBuffer, parent: CompilerParent) {
    group.conditions.forEach((condition, index) => {
      const guardBuffer = buffer.child()

      condition.schema.properties.forEach((child) => {
        this.#compiler.compileNode(child, guardBuffer, parent)
      })

      condition.schema.groups.forEach((child) => {
        this.#compileObjectGroup(child, guardBuffer, parent)
      })

      buffer.writeStatement(
        defineConditionalGuard({
          variableName: this.field.variableName,
          conditional: index === 0 ? 'if' : 'else if',
          conditionalFnRefId: condition.conditionalFnRefId,
          guardedCodeSnippet: guardBuffer.toString(),
        })
      )
    })

    /**
     * Define else block
     */
    if (group.elseConditionalFnRefId && group.conditions.length) {
      buffer.writeStatement(
        defineElseCondition({
          variableName: this.field.variableName,
          conditionalFnRefId: group.elseConditionalFnRefId,
        })
      )
    }
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
     * Wrapping initialization of output + object children validations
     * validation inside `if object field is valid` block.
     *
     * Pre step: 3
     */
    const isObjectValidBlock = defineIsValidGuard({
      variableName: this.field.variableName,
      bail: this.#node.bail,
      guardedCodeSnippet: `${defineObjectInitialOutput({
        variableName: this.field.variableName,
        outputExpression: this.field.outputExpression,
        outputValueExpression: '{}',
      })}${this.#buffer.newLine}${this.#compileObjectChildren()}${
        this.#buffer.newLine
      }${this.#compileObjectGroups()}${this.#buffer.newLine}${defineMoveProperties({
        variableName: this.field.variableName,
        allowUnknownProperties: this.#node.allowUnknownProperties,
        fieldsToIgnore: this.#node.allowUnknownProperties ? this.#getFieldNames(this.#node) : [],
      })}`,
    })

    /**
     * Wrapping field validations + "isObjectValidBlock" inside
     * `if value is object` check.
     *
     * Pre step: 3
     */
    const isValueAnObject = defineObjectGuard({
      variableName: this.field.variableName,
      guardedCodeSnippet: `${defineFieldValidations({
        variableName: this.field.variableName,
        validations: this.#node.validations,
        bail: this.#node.bail,
        dropMissingCheck: true,
      })}${isObjectValidBlock}`,
    })

    /**
     * Step 3: Define `if value is an object` block and `else if value is null`
     * block.
     */
    this.#buffer.writeStatement(
      `${isValueAnObject}${this.#buffer.newLine}${defineFieldNullOutput({
        variableName: this.field.variableName,
        allowNull: this.#node.allowNull,
        outputExpression: this.field.outputExpression,
        conditional: 'else if',
      })}`
    )
  }
}
