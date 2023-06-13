/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RefIdentifier } from '../../types.js'

type FieldOptions = {
  variableName: string
  valueExpression: string
  fieldNameExpression: string
  wildCardPath: string
  parentValueExpression: string
  isArrayMember: boolean
  parseFnRefId?: RefIdentifier
}

/**
 * Returns JS fragment for defining the field variables. It includes, the field
 * value variable, context variable, and a boolean to know if the field
 * exists.
 */
export function defineFieldVariables({
  parseFnRefId,
  variableName,
  wildCardPath,
  isArrayMember,
  valueExpression,
  fieldNameExpression,
  parentValueExpression,
}: FieldOptions) {
  const inValueExpression = parseFnRefId
    ? `refs['${parseFnRefId}'](${valueExpression})`
    : valueExpression

  return `const ${variableName} = defineValue(${inValueExpression}, {
  data: root,
  meta: meta,
  name: ${fieldNameExpression},
  wildCardPath: '${wildCardPath}',
  mutate: defineValue,
  report: report,
  isValid: true,
  parent: ${parentValueExpression},
  isArrayMember: ${isArrayMember},
});`
}
