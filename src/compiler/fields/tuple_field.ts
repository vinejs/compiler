/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CompilerField, CompilerFieldNode, CompilerParent } from '../../types.js'

export function createTupleField(
  node: Pick<CompilerFieldNode, 'fieldName' | 'propertyName'>,
  parent: CompilerParent
): CompilerField {
  return {
    parentVariableName: `${parent.variableName}.value`,
    fieldNameExpression: `${node.fieldName}`,
    fieldPathExpression: `${parent.fieldPathExpression} + '.' + ${node.fieldName}`,
    variableName: `${parent.variableName}_item_${node.fieldName}`,
    valueExpression: `${parent.variableName}.value[${node.fieldName}]`,
    outputExpression: `${parent.outputExpression}[${node.propertyName}]`,
    isArrayMember: true,
  }
}
