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
  const fieldPathExpression =
    parent.fieldPathExpression !== `''`
      ? `${parent.fieldPathExpression} + '.' + '${node.fieldName}'`
      : `'${node.fieldName}'`

  return {
    parentVariableName: `${parent.variableName}.value`,
    fieldNameExpression: `${node.fieldName}`,
    fieldPathExpression: fieldPathExpression,
    variableName: `${parent.variableName}_item_${node.fieldName}`,
    valueExpression: `${parent.variableName}.value[${node.fieldName}]`,
    outputExpression: `${parent.outputExpression}[${node.propertyName}]`,
    isArrayMember: true,
  }
}
