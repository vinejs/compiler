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
  TransformFn,
  ConditionalFn,
  RefIdentifier,
  ValidationRule,
} from './types.js'

/**
 * Creates a refs stores for parsing the schema
 */
export function refsBuilder() {
  let counter = 0
  const refs: Refs = {}

  return {
    toJSON() {
      return refs
    },

    /**
     * Track a value inside refs
     */
    track(value: ValidationRule | TransformFn | ParseFn | ConditionalFn): RefIdentifier {
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
    trackTransformer(fn: TransformFn): RefIdentifier {
      return this.track(fn)
    },

    /**
     * Track a conditional inside refs
     */
    trackConditional(fn: ConditionalFn): RefIdentifier {
      return this.track(fn)
    },
  }
}
