/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Options accepts by the loop script
 */
type ArrayLoopOptions = {
  variableName: string
  loopCodeSnippet: string
  startingIndex?: number
}

/**
 * Returns JS fragment for wrapping code inside an array loop
 */
export function defineArrayLoop({
  variableName,
  loopCodeSnippet,
  startingIndex,
}: ArrayLoopOptions) {
  startingIndex = startingIndex || 0
  return `const ${variableName}_items_size = ${variableName}.value.length;
for (let ${variableName}_i = ${startingIndex}; ${variableName}_i < ${variableName}_items_size; ${variableName}_i++) {
${loopCodeSnippet}
}`
}
