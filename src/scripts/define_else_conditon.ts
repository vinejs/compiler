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
}

/**
 * Returns JS fragment to invoke a function inside else block
 */
export function defineElseCondition({ variableName, conditionalFnRefId }: ConditionalGuardOptions) {
  return `else {
refs['${conditionalFnRefId}'](${variableName}.value, ${variableName});
}`
}
