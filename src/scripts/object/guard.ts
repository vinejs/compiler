/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

type ObjectGuardOptions = {
  variableName: string
  guardedCodeSnippet: string
}

/**
 * Returns JS fragment to wrap code inside an object conditional
 */
export function defineObjectGuard({ variableName, guardedCodeSnippet }: ObjectGuardOptions) {
  return `if (ensureIsObject(${variableName})) {
${guardedCodeSnippet}
}`
}
