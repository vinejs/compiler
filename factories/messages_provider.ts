/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { MessagesProviderContact } from '../src/types.js'

export class MessagesProviderFactory {
  create() {
    const provider: MessagesProviderContact = {
      getMessage(defaultMessage) {
        return defaultMessage
      },
    }

    return provider
  }
}
