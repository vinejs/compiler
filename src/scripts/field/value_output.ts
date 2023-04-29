/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RefIdentifier } from '../../types.js'

/**
 * Options accepts by the output script
 */
type OutputOptions = {
  outputExpression: string
  variableName: string
  transformFnRefId?: RefIdentifier
}

/**
 * Returns JS fragment for writing the validated value to the output.
 */
export function defineFieldValueOutput({
  variableName,
  outputExpression,
  transformFnRefId,
}: OutputOptions) {
  const outputValueExpression = transformFnRefId
    ? `refs['${transformFnRefId}'](${variableName}.value, ${variableName})`
    : `${variableName}.value`

  return `if (${variableName}.isDefined && ${variableName}.isValid) {
  ${outputExpression} = ${outputValueExpression};
}`
}
