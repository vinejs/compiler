/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type {
  Refs,
  ParseFn,
  RefsStore,
  TransformFn,
  ConditionalFn,
  RefIdentifier,
  ValidationRule,
} from './types.js'

/**
 * Creates a refs store for parsing the schema
 */
export function refsBuilder(): RefsStore {
  let counter = 0
  const refs: Refs = {}

  return {
    toJSON() {
      return refs
    },

    /**
     * Track a value inside refs
     */
    track(value: Refs[keyof Refs]): RefIdentifier {
      counter++
      const ref = `ref://${counter}` as const
      refs[ref] = value
      return ref
    },

    /**
     * Track a validation inside refs
     */
    trackValidation(validation: ValidationRule): RefIdentifier {
      return this.track(validation)
    },

    /**
     * Track input value parser inside refs
     */
    trackParser(fn: ParseFn): RefIdentifier {
      return this.track(fn)
    },

    /**
     * Track output value transformer inside refs
     */
    trackTransformer(fn: TransformFn<any, any>): RefIdentifier {
      return this.track(fn)
    },

    /**
     * Track a conditional inside refs
     */
    trackConditional(fn: ConditionalFn<any>): RefIdentifier {
      return this.track(fn)
    },
  }
}
