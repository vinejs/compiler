/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RefIdentifier } from '../../types.js'

type FieldOptions = {
  variableName: string
  parseFnRefId?: RefIdentifier
}

/**
 * Returns JS fragment to call the parse function on the union conditional
 * schema.
 */
export function callParseFunction({ parseFnRefId, variableName }: FieldOptions) {
  if (parseFnRefId) {
    return `${variableName}.value = refs['${parseFnRefId}'](${variableName}.value);`
  }
  return ''
}
