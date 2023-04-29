/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Options accepts by the output script
 */
type OutputOptions = {
  outputExpression: string
  outputValueExpression: string
}

/**
 * Returns JS fragment for writing the initial output for an object
 */
export function defineObjectInitialOutput({
  outputExpression,
  outputValueExpression,
}: OutputOptions) {
  return `${outputExpression} = ${outputValueExpression};`
}
