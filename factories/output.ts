/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EOL } from 'node:os'
import { defineInlineErrorMessages } from '../src/scripts/define_error_messages.js'
import { defineInlineFunctions } from '../src/scripts/define_inline_functions.js'

/**
 * Returns code for the initial output
 */
export function getInitialOutput() {
  return [
    `async function anonymous(root,meta,refs,errorReporter) {`,
    ...defineInlineErrorMessages().split(EOL),
    ...defineInlineFunctions().split(EOL),
    'const out = {};',
  ]
}

/**
 * Returns code for the closing output.
 */
export function getClosingOutput() {
  return [
    `if(errorReporter.hasErrors) {`,
    `  throw errorReporter.createError();`,
    `}`,
    `return out;`,
    '}',
  ]
}
