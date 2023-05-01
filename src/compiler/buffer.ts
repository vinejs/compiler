/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Compiler buffer to collect JS fragments in memory
 */
export class CompilerBuffer {
  #content: string = ''

  /**
   * The character used to create a new line
   */
  newLine = '\n'

  /**
   * Write statement ot the output
   */
  writeStatement(statement: string) {
    this.#content = `${this.#content}${this.newLine}${statement}`
  }

  /**
   * Creates a child buffer
   */
  child() {
    return new CompilerBuffer()
  }

  /**
   * Returns the buffer contents as string
   */
  toString() {
    return this.#content
  }

  /**
   * Flush in-memory string
   */
  flush() {
    this.#content = ''
  }
}
