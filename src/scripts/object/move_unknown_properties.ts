/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Options accepts by the output script
 */
type MovePropertiesOptions = {
  variableName: string
  allowUnknownProperties: boolean
  fieldsToIgnore: string[]
}

/**
 * Converts an array of strings to a string representation
 * like ["foo", "bar"]. Just like node:inspect does.
 */
function arrayToString(arr: string[]) {
  return `[${arr.map((str) => `"${str}"`).join(', ')}]`
}

/**
 * Returns JS fragment for moving properties from the source
 * to destination
 */
export function defineMoveProperties({
  variableName,
  fieldsToIgnore,
  allowUnknownProperties,
}: MovePropertiesOptions) {
  if (!allowUnknownProperties) {
    return ''
  }

  const serializedFieldsToIgnore = arrayToString(fieldsToIgnore)
  return `moveProperties(${variableName}.value, ${variableName}_out, ${serializedFieldsToIgnore});`
}
