/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { parse } from 'acorn'

/**
 * Validates a JS snippet using acorn
 */
export function validateCode(input: string) {
  parse(input, { ecmaVersion: 2020, allowAwaitOutsideFunction: true })
}
