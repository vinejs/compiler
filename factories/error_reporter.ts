/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ErrorReporterContract } from '../src/types.js'

class ValidationError extends Error {
  declare messages: string[]
}

export class ErrorReporterFactory {
  create() {
    const reporter = {
      messages: [] as string[],
      hasErrors: false,
      report(message: string) {
        this.hasErrors = true
        this.messages.push(message)
      },
      createError() {
        const error = new ValidationError('Validation failure')
        error.messages = this.messages
        return error
      },
    }

    return reporter satisfies ErrorReporterContract
  }
}
