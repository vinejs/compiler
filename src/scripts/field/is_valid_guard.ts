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
  bail: boolean
  guardedCodeSnippet: string
}

/**
 * Returns JS fragment to wrap code inside a valid guard
 */
export function defineIsValidGuard({ variableName, bail, guardedCodeSnippet }: ObjectGuardOptions) {
  if (!bail) {
    return guardedCodeSnippet
  }

  return `if (${variableName}.isValid) {
${guardedCodeSnippet}
}`
}
