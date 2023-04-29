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
type RecordLoopOptions = {
  variableName: string
  loopCodeSnippet: string
}

/**
 * Returns JS fragment for wrapping code inside an record loop
 */
export function defineRecordLoop({ variableName, loopCodeSnippet }: RecordLoopOptions) {
  return `const ${variableName}_keys = Object.keys(${variableName}.value);
const ${variableName}_keys_size = ${variableName}_keys.length;
for (let ${variableName}_key_i = 0; ${variableName}_key_i < ${variableName}_keys_size; ${variableName}_key_i++) {
const ${variableName}_i = ${variableName}_keys[${variableName}_key_i];
${loopCodeSnippet}
}`
}
