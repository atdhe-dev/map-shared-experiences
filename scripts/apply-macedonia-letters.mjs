/**
 * Apply Macedonia letter content to Supabase via REST (one row per update).
 * Run: node scripts/apply-macedonia-letters.mjs
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

const LETTERS = [
  {
    id: '98607ac2-8239-4a2d-b530-cb352fb0152a',
    message_to: 'Ana',
    message_type: 'confession',
    emotion_color: 'purple',
    category: 'confession',
    title: 'I watched you read on that bench for a year',
    story:
      'Every morning before work I took the long way through the park. You were always on the same bench, always the same book, coffee going cold while you underlined sentences. I wanted to ask what you were reading. I wanted to say your laugh when the pigeons landed too close was the best part of my day. I never crossed those ten meters. Maybe you never noticed me at all — and that is the part that still hurts.',
    author_mode: 'anonymous',
    author_name: null,
    memory_date: '2019-05-14',
  },
  {
    id: '79cf52c9-937b-4ad0-9b51-df995faaab61',
    message_to: 'Nikola',
    message_type: 'apology',
    emotion_color: 'blue',
    category: 'apology',
    title: 'I should have jumped in after you',
    story:
      'You were twelve. I was fifteen and too proud to look scared. You swam out far at Potpesh and the current pulled — I saw it before you did. I ran along the shore screaming your name instead of going in. A fisherman reached you first. That night Baba slapped me and I deserved it. You never mentioned it again. I am thirty-one now and I still dream of that water. I am sorry I let fear sit between us when you needed your brother.',
    author_mode: 'nickname',
    author_name: 'Goran',
    memory_date: '2011-08-05',
  },
  {
    id: '31a70660-782f-461c-8a71-21451e3b0997',
    message_to: 'Elena',
    message_type: 'goodbye',
    emotion_color: 'gray',
    category: 'goodbye',
    title: 'We never said what the canyon meant',
    story:
      'That afternoon in the kayak you said Matka feels like a church without walls. I laughed because I did not know how to hold something that honest. Two weeks later you left for Vienna and I answered your last message with a thumbs-up emoji. I think about the echo off the stone — how sound comes back different than you sent it. That is us. I hope the Danube is kinder to you than I was.',
    author_mode: 'real_name',
    author_name: 'Stefan D.',
    memory_date: '2018-06-18',
  },
  {
    id: 'e6b72065-3d4e-44be-b9c3-c1488d9d8713',
    message_to: 'Mama',
    message_type: 'thank_you',
    emotion_color: 'yellow',
    category: 'thank_you',
    title: 'The snowman was the only thing we built together',
    story:
      'You worked double shifts in Skopje and came to Mavrovo exhausted, smelling of hospital soap and cigarettes. I was angry at fourteen because you missed my match. That weekend you still drove us up in the old Golf, made tea on a camping stove, and helped me roll the snowman even though your hands were cracked from bleach. I called it stupid. You named it mayor and took a photo I deleted later. I would give anything for that photo now.',
    author_mode: 'anonymous',
    author_name: null,
    memory_date: '2016-01-20',
  },
  {
    id: '1042cc1b-5194-4142-9330-d8d19e98f4c3',
    message_to: 'Arta',
    message_type: 'love',
    emotion_color: 'pink',
    category: 'love',
    title: 'You walked Shirok Sokak like you owned the light',
    story:
      'It was April and you had that red coat from Tetovo, the one your sister sent from Switzerland. We shared one gelato because we were students and pretended it was enough. You told me your father wanted you to marry a dentist in Gostivar. I told you I would figure something out. I did not figure anything out. I let the year eat us. Sometimes I walk the same street and stand where the fountain used to be, hoping you might turn a corner. You never do.',
    author_mode: 'nickname',
    author_name: 'Dardan',
    memory_date: '2017-04-09',
  },
  {
    id: 'fd34bac6-4f7f-46c5-9320-43679ed49ecf',
    message_to: 'Artan',
    message_type: 'memory',
    emotion_color: 'green',
    category: 'memory',
    title: 'We ran out of that hall like we were free',
    story:
      'Painted Mosque in the background, diplomas shaking in our hands, your mother crying in Albanian and my father in Macedonian and neither of them understanding each other but both understanding us. You were the first person who taught me that home can be a language you are still learning. When you moved to Prishtina I said we would visit every month. I visited twice. This letter is not to make myself feel better. It is to tell you that Tetovo square still smells like your cologne when I pass it at night.',
    author_mode: 'real_name',
    author_name: 'Besnik K.',
    memory_date: '2020-07-02',
  },
  {
    id: '79a47a7b-11d3-4d41-847c-9a7fc72d829f',
    message_to: 'Baba',
    message_type: 'goodbye',
    emotion_color: 'purple',
    category: 'goodbye',
    title: 'The apples are still sour without you',
    story:
      'Markovi Kuli turned gold that evening and you told me about the year the harvest failed, how your mother hid bread in the mattress. I thought old stories were far away until they were not. You died in February before the trees woke up. I brought apples to the grave last autumn and could not finish them. Dad says grief is private. I think grief is public and we just pretend otherwise in Prilep.',
    author_mode: 'anonymous',
    author_name: null,
    memory_date: '1998-09-14',
  },
  {
    id: '5141a0c9-3cee-4cf3-9fb1-0e3d9e36c11b',
    message_to: 'Fatmir',
    message_type: 'healing',
    emotion_color: 'blue',
    category: 'healing',
    title: 'The clouds were below us and you were still sad',
    story:
      'We drove up at four in the morning because you said you could not breathe in the flat. Ilinden monument white against the dark, wind that cuts through jackets. You stood on the wall and said nothing for an hour. I should have asked the right question. Instead I took a photo for Instagram. Three months later you stopped answering. If you read this somewhere: the view is still here. You can come back without explaining where you went.',
    author_mode: 'nickname',
    author_name: 'Ivana',
    memory_date: '2022-05-30',
  },
  {
    id: '5486457c-dd82-4731-81b9-e6814bee7fab',
    message_to: 'Marija',
    message_type: 'regret',
    emotion_color: 'red',
    category: 'regret',
    title: 'I chose Berlin over the lake',
    story:
      'We ate fish with our hands like children, grease on our wrists, stars coming out over the water. You said we could buy the small house near Star Dojran — fix it slowly, grow old loudly. I said I needed five years in Germany first, to send money back, to make it proper. Five became ten. You married someone who stayed. I send money still. It arrives empty. Dojran is glass when I visit alone. I see us in it and look away.',
    author_mode: 'real_name',
    author_name: 'Petar N.',
    memory_date: '2014-08-22',
  },
  {
    id: '5161a7a4-66bb-4f43-b709-9f85b5ed7580',
    message_to: 'Hajredin',
    message_type: 'thank_you',
    emotion_color: 'purple',
    category: 'thank_you',
    title: 'You gave me a book when I had no money',
    story:
      'I was seventeen, pockets empty after helping my sister with rent. Your shop smelled of paper and the cinnamon tea you always offered but never charged for. I stood too long with a thin poetry book and you said take it, pay when life is kinder. I paid you seven years later and you had already closed the shop. The book is on my nightstand in Skopje. I read the same poem when I want to remember that Štip once felt like mercy.',
    author_mode: 'anonymous',
    author_name: null,
    memory_date: '2012-11-03',
  },
  {
    id: '879e06ee-b1c9-4c9f-839d-6243fe4d7ee6',
    message_to: 'The woman at the blue awning',
    message_type: 'memory',
    emotion_color: 'orange',
    category: 'memory',
    title: 'You fed me when I had forty denars',
    story:
      'It was January and the bus from Kumanovo was late and my wallet was stolen near the Stone Bridge. I stood at your window with forty denars and shame so thick I could taste it. You wrapped two bureks, hot, cheese running through the paper, and pushed an extra one across the counter without a word. I wanted to say my name. I wanted to say thank you in a language big enough. I never found your stall again after the renovation. I hope your hands are still warm.',
    author_mode: 'nickname',
    author_name: 'Besa',
    memory_date: null,
  },
  {
    id: '492b71ae-e13d-4ad7-84ff-5c9a96e680cc',
    message_to: 'Dragan, Simona, and Viktor',
    message_type: 'love',
    emotion_color: 'pink',
    category: 'love',
    title: "We walked home singing off-key on New Year's Eve",
    story:
      'The last bus left without us near Debar Maalo and we decided walking to Aerodrom at two in the morning was wisdom. You carried my shoes when the blisters broke. Simona lied to her parents on the phone and said we were at a study group. Viktor quoted poetry badly and we laughed until the Vardar sounded like applause. That night we promised to show up for each other. Life scattered us — Zurich, Dubai, a village near Strumica. I am writing to say the promise still stands on my side.',
    author_mode: 'anonymous',
    author_name: null,
    memory_date: '2015-12-31',
  },
  {
    id: '68ac6f3e-d2a8-4a03-86d1-769e0735399d',
    message_to: 'Snežana',
    message_type: 'love',
    emotion_color: 'red',
    category: 'love',
    title: 'Rain on the windows, your kitchen, our first dance',
    story:
      'Radio Skopje played something old and you said you did not know how to slow-dance in socks on linoleum. I said neither do I and we stepped on each other\'s feet like teenagers though we were already twenty-six. The radiator clicked. Rain made the city small. I wanted to tell you that I had loved you since the protest on Macedonia Square when you shouted louder than the loudspeakers. I said nothing. We divorced kindly three years later. I still remember the song.',
    author_mode: 'anonymous',
    author_name: null,
    memory_date: '2018-02-14',
  },
  {
    id: 'fa3ee44b-e540-4dda-8b70-7d81ad253167',
    message_to: 'Prof. Dimovski',
    message_type: 'thank_you',
    emotion_color: 'green',
    category: 'thank_you',
    title: 'You said I belong here and I almost believed you',
    story:
      'First day at the firm near Karposh, new shoes biting my heels, hands shaking on the keyboard. You were not even my boss — you were the client who waited while I rebooted the laptop twice. You said calm down, everyone breaks things on day one, you belong here. Nobody had said that to me in Skopje before. I thought belonging was something you earned by leaving and returning with a foreign salary. I stayed. I am still here. You retired without me saying this properly.',
    author_mode: 'real_name',
    author_name: 'Marija S.',
    memory_date: '2017-09-01',
  },
  {
    id: '9a46b0ba-527d-4e7f-87a1-94d3f738d74e',
    message_to: 'Blagoj',
    message_type: 'memory',
    emotion_color: 'yellow',
    category: 'memory',
    title: 'You filmed me falling and we laughed until we cried',
    story:
      'Parking lot behind the hospital in Štip, ice like glass, coffee flying, my dignity gone in one second. You could have helped me up. Instead you filmed and wheezed so hard you sat on a car bumper. We watched the video seventeen times that night with rakija and tears. Last year you got sick and I held your hand in the same building I fell in front of. I never told you that video is still on my phone. I watch it when I need proof that joy can live next to pain.',
    author_mode: 'nickname',
    author_name: 'Blagica',
    memory_date: '2021-01-08',
  },
  {
    id: 'e14b6ac2-7e8c-49a6-831c-7530b25fc304',
    message_to: 'Baba',
    message_type: 'memory',
    emotion_color: 'orange',
    category: 'memory',
    title: 'The best food was never at a restaurant',
    story:
      'Loznica on a Sunday, your kitchen full of steam, ajvar on every burner, my cousins arguing about football in the yard. You said Gevgelija is where the country exhales before the border. I ate until I could not stand and you smacked my hand when I tried to wash my own plate. I live in Switzerland now. They have Michelin stars. None of them taste like your tava. I am coming back in August. I hope the door is still unlocked.',
    author_mode: 'real_name',
    author_name: 'Adi',
    location_name: 'Gevgelija',
    memory_date: '2009-08-12',
  },
]

const env = loadEnv()
const url = env.VITE_SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or key in .env')
  process.exit(1)
}

const sb = createClient(url, key)
let ok = 0
let fail = 0

console.log('\nApplying Macedonia letter content…\n')

for (const letter of LETTERS) {
  const { id, location_name, ...fields } = letter
  const patch = { ...fields, image_url: null, status: 'approved' }
  if (location_name) patch.location_name = location_name

  const { data, error } = await sb.from('experiences').update(patch).eq('id', id).select('id')
  if (error) {
    fail++
    console.error(`  ✗ ${letter.message_to}: ${error.message}`)
  } else if (!data?.length) {
    fail++
    console.error(`  ✗ ${letter.message_to}: no rows updated (check RLS — use Supabase SQL Editor or SUPABASE_SERVICE_ROLE_KEY)`)
  } else {
    ok++
    console.log(`  ✓ To: ${letter.message_to}`)
  }
}

const reject = await sb
  .from('experiences')
  .update({ status: 'rejected' })
  .or('status.eq.pending,title.ilike.smoke test%,title.ilike.test pending%,title.eq.Nick test')

if (reject.error) {
  console.warn(`  ~ Could not reject test posts: ${reject.error.message}`)
} else {
  console.log(`  ✓ Test posts hidden (${reject.data?.length ?? 'ok'})`)
}

console.log(`\nDone: ${ok} updated, ${fail} failed.\n`)
process.exit(fail ? 1 : 0)
