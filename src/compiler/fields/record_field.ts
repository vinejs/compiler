/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CompilerField, CompilerParent } from '../../types.js'

export function createRecordField(parent: CompilerParent): CompilerField {
  return {
    parentVariableName: `${parent.variableName}.value`,
    fieldNameExpression: `${parent.variableName}_i`,
    fieldPathExpression: `${parent.fieldPathExpression} + '.' + ${parent.variableName}_i`,
    variableName: `${parent.variableName}_item`,
    valueExpression: `${parent.variableName}.value[${parent.variableName}_i]`,
    outputExpression: `${parent.outputExpression}[${parent.variableName}_i]`,
    isArrayMember: false,
  }
}