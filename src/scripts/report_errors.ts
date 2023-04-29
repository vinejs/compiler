/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Returns JS fragment to report errors
 */
export function reportErrors() {
  return `if(errorReporter.hasErrors) {
  throw errorReporter.createError();
}`
}
