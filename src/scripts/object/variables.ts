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
 * Returns JS fragment for defining the object variables
 */
export function defineObjectVariables({ variableName }: FieldOptions) {
  return `const ${variableName}_is_object = ensureIsObject(${variableName});`
}
