/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

type FieldOptions = {
  variableName: string
}

/**
 * Returns JS fragment for validating the field to be an object
 */
export function validateObjectField({ variableName }: FieldOptions) {
  return `${variableName}.isValidDataType = ensureIsObject(${variableName});`
}
