/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CompilerField, CompilerFieldNode } from '../../types.js'

export function createField(
  node: Pick<CompilerFieldNode, 'fieldName' | 'propertyName'>,
  variablesCounter: number
): CompilerField {
  return {
    parentVariableName: 'root',
    fieldNameExpression: `'${node.fieldName}'`,
    fieldPathExpression: `'${node.fieldName}'`,
    variableName: `${node.propertyName}_${variablesCounter}`,
    valueExpression: `root['${node.fieldName}']`,
    outputExpression: `out['${node.propertyName}']`,
    isArrayMember: false,
  }
}
