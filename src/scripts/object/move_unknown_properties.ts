/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { inspect } from 'node:util'

/**
 * Options accepts by the output script
 */
type MovePropertiesOptions = {
  variableName: string
  outputExpression: string
  allowUnknownProperties: boolean
  fieldsToIgnore: string[]
}

/**
 * Returns JS fragment for moving properties from the source
 * to destination
 */
export function defineMoveProperties({
  variableName,
  fieldsToIgnore,
  outputExpression,
  allowUnknownProperties,
}: MovePropertiesOptions) {
  if (!allowUnknownProperties) {
    return ''
  }
  return `moveProperties(${variableName}.value, ${outputExpression}, ${inspect(fieldsToIgnore)});`
}
