/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const NUMBER_CHAR_RE = /\d/
const VALID_CHARS = /[A-Za-z0-9]+/

/**
 * Returns if the first charcater is uppercase or not
 */
function isUppercase(char = ''): boolean | undefined {
  if (NUMBER_CHAR_RE.test(char)) {
    return undefined
  }
  return char !== char.toLowerCase()
}

/**
 * Converts the first character to uppercase
 */
function upperFirst(value: string): string {
  return value ? value[0].toUpperCase() + value.slice(1) : ''
}

/**
 * Converts the first character to lowercase
 */
function lowerFirst(value: string) {
  return value ? value[0].toLowerCase() + value.slice(1) : ''
}

/**
 * Splits the string value by special characters
 */
function splitByCase(value: string) {
  const parts: string[] = []
  if (!value || typeof value !== 'string') {
    return parts
  }

  let buff = ''
  let previousUpper: boolean | undefined
  let previousSplitter: boolean | undefined

  for (const char of value) {
    const isSplitter = !VALID_CHARS.test(char)
    if (isSplitter === true) {
      parts.push(buff)
      buff = ''
      previousUpper = undefined
      continue
    }

    const isUpper = isUppercase(char)
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff)
        buff = char
        previousUpper = isUpper
        continue
      }

      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1)
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)))
        buff = lastChar + char
        previousUpper = isUpper
        continue
      }
    }

    buff += char
    previousUpper = isUpper
    previousSplitter = isSplitter
  }

  parts.push(buff)
  return parts
}

/**
 * Converts the value to a valid JavaScript variable name
 */
export function toVariableName(value: string) {
  const pascalCase = splitByCase(value)
    .map((p) => upperFirst(p.toLowerCase()))
    .join('')

  return /^[0-9]+/.test(pascalCase) ? `var_${pascalCase}` : lowerFirst(pascalCase)
}
