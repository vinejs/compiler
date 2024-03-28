/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CompilerField, FieldNode, CompilerParent } from '../../types.js'

export function createTupleField(
  node: Pick<FieldNode, 'fieldName' | 'propertyName'>,
  parent: CompilerParent
): CompilerField {
  const wildCardPath =
    parent.wildCardPath !== '' ? `${parent.wildCardPath}.${node.fieldName}` : node.fieldName

  return {
    parentExpression: parent.variableName,
    parentValueExpression: `${parent.variableName}.value`,
    fieldNameExpression: `${node.fieldName}`,
    fieldPathExpression: wildCardPath,
    wildCardPath: wildCardPath,
    variableName: `${parent.variableName}_item_${node.fieldName}`,
    valueExpression: `${parent.variableName}.value[${node.fieldName}]`,
    outputExpression: `${parent.variableName}_out[${node.propertyName}]`,
    isArrayMember: true,
  }
}
