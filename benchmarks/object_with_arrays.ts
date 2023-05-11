import { z } from 'zod'
// @ts-ignore
import Benchmark from 'benchmark'
import Ajv, { AsyncValidateFunction } from 'ajv'
import { Compiler } from '../src/compiler/main.js'
import { ErrorReporterFactory } from '../factories/error_reporter.js'

const suite = new Benchmark.Suite()

const data = { contacts: [{ email: 'foo@bar.com' }] }
const meta = {}
const refs = {
  'ref://1': {
    validator(value: unknown, _: any, ctx: any) {
      if (typeof value !== 'string') {
        ctx.report('Value is not a string', ctx)
      }
    },
    options: {},
  },
}
const errorReporter = new ErrorReporterFactory().create()

const zodSchema = z.object({
  contacts: z.array(
    z.object({
      email: z.string(),
    })
  ),
})

const compiler = new Compiler({
  type: 'root',
  schema: {
    type: 'object',
    allowNull: false,
    isOptional: false,
    fieldName: '*',
    allowUnknownProperties: false,
    bail: true,
    properties: [
      {
        type: 'array',
        fieldName: 'contacts',
        propertyName: 'contacts',
        allowNull: false,
        bail: true,
        isOptional: false,
        each: {
          type: 'object',
          propertyName: '*',
          allowNull: false,
          allowUnknownProperties: false,
          isOptional: false,
          fieldName: '*',
          bail: true,
          groups: [],
          properties: [
            {
              type: 'literal',
              bail: true,
              allowNull: false,
              fieldName: 'email',
              propertyName: 'email',
              isOptional: false,
              validations: [
                {
                  isAsync: false,
                  ruleFnId: 'ref://1',
                  implicit: false,
                },
              ],
            },
          ],
          validations: [],
        },
        validations: [],
      },
    ],
    groups: [],
    propertyName: '*',
    validations: [],
  },
})

compiler.compile()
const fn = compiler.compile()

const ajv = new Ajv.default({ removeAdditional: true })
const ajvSchema = {
  $async: true,
  type: 'object',
  properties: {
    contacts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          email: { type: 'string' },
        },
        required: ['email'],
      },
    },
  },
  required: ['contacts'],
}

const ajvValidate = ajv.compile(ajvSchema) as AsyncValidateFunction<any>

suite
  .add('VineJS compiler', {
    defer: true,

    // benchmark test function
    fn: function (deferred: any) {
      fn(data, meta, refs, errorReporter).then(() => deferred.resolve())
    },
  })
  .add('Ajv', {
    defer: true,

    // benchmark test function
    fn: function (deferred: any) {
      ajvValidate(data).then(() => deferred.resolve())
    },
  })
  .add('Zod', {
    defer: true,
    fn(deferred: any) {
      zodSchema.parseAsync(data).then(() => deferred.resolve())
    },
  })
  .on('cycle', function (event: any) {
    console.log(String(event.target))
  })
  .on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
