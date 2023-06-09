/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EOL } from 'node:os'
import type { CompilerOptions } from '../src/types.js'
import { defineInlineErrorMessages } from '../src/scripts/define_error_messages.js'
import { defineInlineFunctions } from '../src/scripts/define_inline_functions.js'

/**
 * Returns code for the initial output
 */
export function getInitialOutput(options?: CompilerOptions) {
  return [
    `async function anonymous(root,meta,refs,messagesProvider,errorReporter) {`,
    ...defineInlineErrorMessages({
      required: 'value is required',
      object: 'value is not a valid object',
      array: 'value is not a valid array',
    }).split(EOL),
    ...defineInlineFunctions(options || { convertEmptyStringsToNull: false }).split(EOL),
    'let out;',
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
