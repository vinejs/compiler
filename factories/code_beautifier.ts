/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// @ts-expect-error
import js from 'js-beautify'

/**
 * Validates a JS snippet using acorn
 */
export function beautifyCode(input: string | string[]) {
  return {
    value: js(Array.isArray(input) ? input.join('\n') : input, {
      indent_size: '2',
      indent_char: ' ',
      max_preserve_newlines: '-1',
      preserve_newlines: false,
      keep_array_indentation: false,
      break_chained_methods: false,
      indent_scripts: 'normal',
      brace_style: 'collapse',
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: false,
      wrap_line_length: '0',
      indent_inner_html: false,
      comma_first: false,
      e4x: false,
      indent_empty_lines: false,
    }),
    toString() {
      return this.value
    },
    toArray() {
      return this.value.split('\n')
    },
  }
}
