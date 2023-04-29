/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

type ArrayGuardOptions = {
  variableName: string
  guardedCodeSnippet: string
}

/**
 * Returns JS fragment to wrap code inside an array conditional
 */
export function defineArrayGuard({ variableName, guardedCodeSnippet }: ArrayGuardOptions) {
  return `if (ensureIsArray(${variableName})) {
${guardedCodeSnippet}
}`
}
