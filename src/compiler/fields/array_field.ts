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
  const wildCardPath = parent.wildCardPath !== '' ? `${parent.wildCardPath}.*` : `*`

  return {
    parentExpression: parent.variableName,
    parentValueExpression: `${parent.variableName}.value`,
    fieldNameExpression: `${parent.variableName}_i`,
    fieldPathExpression: wildCardPath,
    wildCardPath: wildCardPath,
    variableName: `${parent.variableName}_item`,
    valueExpression: `${parent.variableName}.value[${parent.variableName}_i]`,
    outputExpression: `${parent.variableName}_out[${parent.variableName}_i]`,
    isArrayMember: true,
  }
}
