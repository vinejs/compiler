/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CompilerField, CompilerParent } from '../../types.js'

export function createArrayField(parent: CompilerParent): CompilerField {
  const fieldPathExpression =
    parent.fieldPathExpression !== `''`
      ? `${parent.fieldPathExpression} + '.' + ${parent.variableName}_i`
      : `${parent.variableName}_i`

  const wildCardPath = parent.wildCardPath !== '' ? `${parent.wildCardPath}.*` : `*`

  return {
    parentValueExpression: `${parent.variableName}.value`,
    fieldNameExpression: `${parent.variableName}_i`,
    fieldPathExpression: fieldPathExpression,
    wildCardPath: wildCardPath,
    variableName: `${parent.variableName}_item`,
    valueExpression: `${parent.variableName}.value[${parent.variableName}_i]`,
    outputExpression: `${parent.outputExpression}[${parent.variableName}_i]`,
    isArrayMember: true,
  }
}
