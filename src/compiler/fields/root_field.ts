/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CompilerField, CompilerParent } from '../../types.js'

export function createRootField(parent: CompilerParent): CompilerField {
  return {
    parentExpression: parent.variableName,
    parentValueExpression: parent.variableName,
    fieldNameExpression: `''`,
    fieldPathExpression: `''`,
    wildCardPath: '',
    variableName: `${parent.variableName}_item`,
    valueExpression: 'root',
    outputExpression: parent.outputExpression,
    isArrayMember: false,
  }
}
