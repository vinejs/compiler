/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { type ValidationNode } from '../../types.js'

/**
 * Options accepts by the validation script
 */
type ValidationOptions = {
  bail: boolean
  synchronous?: boolean
  variableName: string
  validations: ValidationNode[]

  /**
   * Drop missing conditional check regardless of whether
   * rule is implicit or not
   */
  dropMissingCheck: boolean

  /**
   * The expression to use for performing the existence check.
   * Defaults to "item.isDefined"
   */
  existenceCheckExpression?: string
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
  { name, isAsync, implicit, ruleFnId }: ValidationNode,
  variableName: string,
  bail: boolean,
  synchronous: boolean,
  dropMissingCheck: boolean,
  existenceCheckExpression?: string
) {
  const rule = `refs['${ruleFnId}']`
  const callable = `${rule}.validator(${variableName}.value, ${rule}.options, ${variableName})`
  existenceCheckExpression = existenceCheckExpression || `${variableName}.isDefined`

  /**
   * Add "isValid" condition when the bail flag is turned on.
   */
  const bailCondition = bail ? `${variableName}.isValid` : ''

  /**
   * Add the "!is_[variableName]_missing" conditional when the rule is not implicit.
   */
  const implicitCondition = implicit || dropMissingCheck ? '' : existenceCheckExpression

  /**
   * Wrapping the validation invocation inside conditionals based upon
   * enabled flags.
   */
  return wrapInConditional(
    [bailCondition, implicitCondition],
    isAsync
      ? `await ${callable};`
      : synchronous
        ? `ensureIsNotPromise(${callable}, ${JSON.stringify(name || ruleFnId)}, ${variableName});`
        : `${callable};`
  )
}

/**
 * Returns JS fragment for executing validations for a given field.
 */
export function defineFieldValidations({
  bail,
  synchronous = false,
  validations,
  variableName,
  dropMissingCheck,
  existenceCheckExpression,
}: ValidationOptions) {
  return `${validations
    .map((one) =>
      emitValidationSnippet(
        one,
        variableName,
        bail,
        synchronous,
        dropMissingCheck,
        existenceCheckExpression
      )
    )
    .join('\n')}`
}
