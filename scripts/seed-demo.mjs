#!/usr/bin/env node
/**
 * Seed demo experiences — requires Supabase SQL Editor or MCP.
 * This script prints instructions; run the SQL file directly in Supabase Dashboard.
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedPath = join(__dirname, 'seed-demo-experiences.sql')
const photosPath = join(__dirname, 'update-demo-photos.sql')
const isPhotos = process.argv[2] === 'photos'

if (isPhotos) {
  console.log(`
Shared Experiences MK — Demo Photos
====================================

Adds real Wikimedia Commons photos for every demo pin (Matka, Ohrid, etc.).

Run in Supabase Dashboard → SQL Editor:
  ${photosPath}

Or copy from: scripts/update-demo-photos.sql
`)
  try {
    console.log('--- SQL preview (first 600 chars) ---')
    console.log(readFileSync(photosPath, 'utf8').slice(0, 600) + '...\n')
  } catch {
    console.error('Could not read update-demo-photos.sql')
    process.exit(1)
  }
  process.exit(0)
}

const sqlPath = seedPath

console.log(`
Shared Experiences MK — Demo Seed
==================================

To seed demo experiences, run this SQL in Supabase Dashboard:
  SQL Editor → New query → paste contents of:
  ${sqlPath}

Or copy from: scripts/seed-demo-experiences.sql

Demo pins include real location photos (Wikimedia Commons).
To refresh photos on an existing database: npm run seed:photos

The script is idempotent — it skips if demo data already exists.
`)

try {
  const sql = readFileSync(sqlPath, 'utf8')
  console.log('--- SQL preview (first 500 chars) ---')
  console.log(sql.slice(0, 500) + '...\n')
} catch {
  console.error('Could not read seed SQL file.')
  process.exit(1)
}
