/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { type RefIdentifier } from '../../types.js'

type FieldOptions = {
  parentExpression: string
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
  parentExpression,
  fieldNameExpression,
  parentValueExpression,
}: FieldOptions) {
  const inValueExpression = parseFnRefId
    ? `refs['${parseFnRefId}'](${valueExpression}, {
      data: root,
      meta: meta,
      parent: ${parentValueExpression}
    })`
    : valueExpression

  /**
   * Field path output expression is the value that is
   * returned when "field.getFieldPath" method is
   * called.
   */
  let fieldPathOutputExpression = ''

  /**
   * When we are a direct member of a root field, we will not prefix the root path, since
   * there is no path to prefix, its just root.
   */
  if (parentExpression === 'root' || parentExpression === 'root_item') {
    fieldPathOutputExpression = fieldNameExpression
  } else if (fieldNameExpression !== "''") {
    /**
     * When we are the root ourselves, we will return an empty string
     * value.
     */
    fieldPathOutputExpression = `${parentExpression}.getFieldPath() + '.' + ${fieldNameExpression}`
  }

  return `const ${variableName} = defineValue(${inValueExpression}, {
  data: root,
  meta: meta,
  name: ${fieldNameExpression},
  wildCardPath: '${wildCardPath}',
  getFieldPath() {
    return ${fieldPathOutputExpression};
  },
  mutate: defineValue,
  report: report,
  isValid: true,
  isValidDataType: false,
  parent: ${parentValueExpression},
  isArrayMember: ${isArrayMember},
});`
}

/**
 * Returns JS fragment for validating the literal field
 */
export function validateLiteralField({
  variableName,
  validatorFnId,
}: {
  variableName: string
  validatorFnId: string
}) {
  const rule = `refs['${validatorFnId}']`
  const callable = `${rule}.validator(${variableName}.value, ${rule}.options, ${variableName});`
  return `${variableName}.isValidDataType = ${callable}`
}
