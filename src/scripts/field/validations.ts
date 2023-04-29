/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EOL } from 'node:os'
import { CompilerValidationNode } from '../../types.js'

/**
 * Options accepts by the validation script
 */
type ValidationOptions = {
  bail: boolean
  variableName: string
  validations: CompilerValidationNode[]

  /**
   * Drop missing conditional check regardless of whether
   * rule is implicit or not
   */
  dropMissingCheck: boolean
}

/**
 * Helper to generate a conditional based upon enabled conditions.
 */
function wrapInConditional(conditions: [string, string], wrappingCode: string) {
  const [first, second] = conditions
  if (first && second) {
    return `if (${first} && ${second}) {
  ${wrappingCode}
}`
  }

  if (first) {
    return `if (${first}) {
  ${wrappingCode}
}`
  }

  if (second) {
    return `if (${second}) {
  ${wrappingCode}
}`
  }

  return wrappingCode
}

/**
 * Emits code for executing a validation function
 */
function emitValidationSnippet(
  { isAsync, implicit, ruleFnId }: CompilerValidationNode,
  variableName: string,
  bail: boolean,
  dropMissingCheck: boolean
) {
  const rule = `refs['${ruleFnId}']`
  const callable = `${rule}.validator(${variableName}.value, ${rule}.options, ${variableName});`

  /**
   * Add "isValid" condition when the bail flag is turned on.
   */
  const bailCondition = bail ? `${variableName}.isValid` : ''

  /**
   * Add the "!is_[variableName]_missing" conditional when the rule is not implicit.
   */
  const implicitCondition = implicit || dropMissingCheck ? '' : `${variableName}.isDefined`

  /**
   * Wrapping the validation invocation inside conditionals based upon
   * enabled flags.
   */
  return wrapInConditional(
    [bailCondition, implicitCondition],
    isAsync ? `await ${callable}` : `${callable}`
  )
}

/**
 * Returns JS fragment for executing validations for a given field.
 */
export function defineFieldValidations({
  bail,
  validations,
  variableName,
  dropMissingCheck,
}: ValidationOptions) {
  return `${validations
    .map((one) => emitValidationSnippet(one, variableName, bail, dropMissingCheck))
    .join(EOL)}`
}
