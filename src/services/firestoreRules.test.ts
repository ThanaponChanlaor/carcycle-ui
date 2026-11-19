import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

// No emulator here, so this pins the rule text. With Email/Password on, anyone holding the
// public API key can sign up through the REST API, so "signed in" must not be enough to write.
const rules = readFileSync('firestore.rules', 'utf8')

it('lets only the admin email write, not any signed-in account', () => {
  const writes = rules.split('\n').filter((line) => line.includes('allow write'))
  expect(writes).toHaveLength(2)
  for (const line of writes) {
    expect(line).toContain("request.auth.token.email == 'ADMIN_EMAIL'")
  }
})
