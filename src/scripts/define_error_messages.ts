/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CompilerOptions } from '../types.js'

/**
 * Returns JS fragment for inline error messages for errors raised
 * by the compiler.
 */
export function defineInlineErrorMessages(
  messages: Required<Exclude<CompilerOptions['messages'], undefined>>
) {
  return `const REQUIRED = '${messages.required}';
const NOT_AN_OBJECT = '${messages.object}';
const NOT_AN_ARRAY = '${messages.array}';`
}
