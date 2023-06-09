import { Compiler } from '../../src/compiler/main.js'
import { beautifyCode } from '../../factories/code_beautifier.js'
import { refs, schema } from './schema.js'
import { ErrorReporterFactory } from '../../factories/error_reporter.js'
import { MessagesProviderFactory } from '../../factories/messages_provider.js'

const compiler = new Compiler(schema)
const fn = compiler.compile()

console.log('========= COMPILED OUTPUT =========')
console.log(beautifyCode(fn.toString()).toString())
console.log('========= END COMPILED OUTPUT =========')

const data = {
  email: 'foo',
  password: 'secret',
}
const messagesProvider = new MessagesProviderFactory().create()
const errorReporter = new ErrorReporterFactory().create()

const output = await fn(data, {}, refs, messagesProvider, errorReporter)

console.log('')
console.log('========= VALIDATED OUTPUT =========')
console.log(output)
console.log('========= END VALIDATED OUTPUT =========')
