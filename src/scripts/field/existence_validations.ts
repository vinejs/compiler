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
  isOptional: boolean
  allowNull: boolean
}

/**
 * Returns JS fragment to validate a field's value for existence.
 */
export function defineFieldExistenceValidations({
  allowNull,
  isOptional,
  variableName,
}: FieldOptions): string {
  /**
   * Validations are only performed when `isOptional` flag
   * is disabled.
   */
  if (isOptional === false) {
    /**
     * When `allowNull` flag is disabled, we should ensure the value
     * is not null and neither undefined.
     */
    if (allowNull === false) {
      return `ensureExists(${variableName});`
    } else {
      /**
       * Otherwise ensure the value is not undefined.
       */
      return `ensureIsDefined(${variableName});`
    }
  }

  return ''
}
