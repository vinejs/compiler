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
  allowNull: boolean
  transformFnRefId?: RefIdentifier
  conditional?: 'if' | 'else if'
}

/**
 * Returns JS fragment for writing the null value to the output.
 */
export function defineFieldNullOutput({
  allowNull,
  conditional,
  variableName,
  outputExpression,
  transformFnRefId,
}: OutputOptions) {
  if (!allowNull) {
    return ''
  }

  return `${conditional || 'if'}(${variableName}.value === null) {
  ${outputExpression} = ${
    transformFnRefId ? `refs['${transformFnRefId}'](null, ${variableName});` : 'null;'
  }
}`
}
