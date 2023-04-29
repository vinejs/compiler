/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CompilerField, CompilerFieldNode, CompilerParent } from '../../types.js'

export function createObjectField(
  node: Pick<CompilerFieldNode, 'fieldName' | 'propertyName'>,
  variablesCounter: number,
  parent: CompilerParent
): CompilerField {
  return {
    parentVariableName: `${parent.variableName}.value`,
    fieldNameExpression: `'${node.fieldName}'`,
    fieldPathExpression: `${parent.fieldPathExpression} + '.' + '${node.fieldName}'`,
    variableName: `${node.propertyName}_${variablesCounter}`,
    valueExpression: `${parent.variableName}.value['${node.fieldName}']`,
    outputExpression: `${parent.outputExpression}['${node.propertyName}']`,
    isArrayMember: false,
  }
}
