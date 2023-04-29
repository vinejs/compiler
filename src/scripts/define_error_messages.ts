/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Returns JS fragment for inline error messages for errors raised
 * by the compiler.
 */
export function defineInlineErrorMessages() {
  return `const REQUIRED = 'value is required';
const NOT_AN_OBJECT = 'value is not a valid object';
const NOT_AN_ARRAY = 'value is not a valid array';`
}
