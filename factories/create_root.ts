/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ObjectNode, RootNode } from '../src/types.js'

export function createRoot(schema: ObjectNode): RootNode {
  return {
    type: 'root',
    schema: schema,
  }
}

export function createObjectRoot(nodes: ObjectNode['properties']): RootNode {
  return createRoot({
    type: 'object',
    fieldName: '*',
    propertyName: '*',
    isOptional: false,
    allowNull: false,
    allowUnknownProperties: false,
    bail: true,
    properties: nodes,
    groups: [],
    validations: [],
  })
}
