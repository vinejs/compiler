import '@japa/assert'

declare module '@japa/assert' {
  interface Assert {
    assertFormatted(actual: string | string[], expected: string | string[]): void
  }
}
