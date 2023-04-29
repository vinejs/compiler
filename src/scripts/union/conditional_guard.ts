/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

type ConditionalGuardOptions = {
  variableName: string
  conditionalFnRefId: string
  guardedCodeSnippet: string
  conditional: 'if' | 'else if'
}

/**
 * Returns JS fragment to wrap code inside the union conditional guard
 */
export function defineConditionalGuard({
  variableName,
  conditionalFnRefId,
  guardedCodeSnippet,
  conditional,
}: ConditionalGuardOptions) {
  return `${conditional}(refs['${conditionalFnRefId}'](${variableName}.value, ${variableName})) {
${guardedCodeSnippet}
}`
}
