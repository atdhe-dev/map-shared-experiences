/**
 * API smoke tests using publishable key (same as frontend).
 * Run: node scripts/test-api.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

function loadEnv() {
  try {
    const raw = readFileSync('.env', 'utf8')
    const env = {}
    for (const line of raw.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m) env[m[1].trim()] = m[2].trim()
    }
    return env
  } catch {
    return {}
  }
}

const env = loadEnv()
const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  console.error('FAIL: Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env')
  process.exit(1)
}

const sb = createClient(url, key)
let passed = 0
let failed = 0

function ok(name) {
  passed++
  console.log(`  ✓ ${name}`)
}

function fail(name, detail) {
  failed++
  console.error(`  ✗ ${name}: ${detail}`)
}

console.log('\nShared Experiences MK — API smoke tests\n')

// 1. Fetch approved (public read)
const approved = await sb.from('experiences').select('id, status').eq('status', 'approved')
if (approved.error) fail('Fetch approved experiences', approved.error.message)
else ok(`Fetch approved experiences (${approved.data?.length ?? 0} rows)`)

// 2. Cannot read pending as anon
const pending = await sb.from('experiences').select('id').eq('status', 'pending')
if (pending.error) ok('Pending hidden from public (RLS)')
else if ((pending.data?.length ?? 0) === 0) ok('Pending hidden from public (empty result)')
else fail('Pending hidden from public', `Got ${pending.data.length} pending rows`)

// 3. Insert pending without select
const testTitle = `Smoke test ${Date.now()}`
const insert = await sb.from('experiences').insert({
  title: testTitle,
  story: 'Automated smoke test story — safe to delete from admin.',
  category: 'other',
  lat: 41.9981,
  lng: 21.4254,
  location_name: 'Skopje City Park',
  author_mode: 'anonymous',
  status: 'pending',
})
if (insert.error) fail('Insert pending experience', insert.error.message)
else ok('Insert pending experience (no select)')

// 4. Pending not in approved fetch
const afterInsert = await sb.from('experiences').select('id').eq('title', testTitle)
if (afterInsert.error || (afterInsert.data?.length ?? 0) === 0) ok('Pending post not publicly readable')
else fail('Pending post not publicly readable', 'Pending row visible to anon')

// 5. Reaction RPC on approved (if any approved exist)
if (approved.data?.length) {
  const expId = approved.data[0].id
  const fp = `smoke-test-${Date.now()}`
  const react = await sb.rpc('add_experience_reaction', {
    p_experience_id: expId,
    p_fingerprint: fp,
  })
  if (react.error) fail('Add reaction RPC', react.error.message)
  else ok(`Add reaction RPC (success=${react.data?.success})`)

  const reactDup = await sb.rpc('add_experience_reaction', {
    p_experience_id: expId,
    p_fingerprint: fp,
  })
  if (reactDup.error) fail('Duplicate reaction blocked', reactDup.error.message)
  else if (reactDup.data?.success === false) ok('Duplicate reaction blocked')
  else fail('Duplicate reaction blocked', 'Second reaction succeeded')
} else {
  console.log('  ~ Skipping reaction test (no approved experiences — run npm run seed:demo)')
}

console.log(`\nResults: ${passed} passed, ${failed} failed\n`)
process.exit(failed > 0 ? 1 : 0)
