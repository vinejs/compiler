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
  variableName: string
  outputExpression: string
  outputValueExpression: string
}

/**
 * Returns JS fragment for writing the initial output for an array
 */
export function defineArrayInitialOutput({
  variableName,
  outputExpression,
  outputValueExpression,
}: OutputOptions) {
  return `const ${variableName}_out = ${outputValueExpression};
${outputExpression} = ${variableName}_out;`
}
