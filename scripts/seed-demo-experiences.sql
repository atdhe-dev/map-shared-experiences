-- Demo unsent letters for North Macedonia (Macedonian & Albanian names)
-- Run in Supabase SQL Editor or: npm run seed:demo
-- Skips insert if demo data already exists.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM experiences WHERE title = 'I watched you read on that bench for a year'
  ) THEN
    RAISE NOTICE 'Demo letters already exist — skipping.';
    RETURN;
  END IF;

  INSERT INTO experiences (
    title, story, category, message_to, message_type, emotion_color,
    lat, lng, location_name, image_url, author_mode, author_name,
    memory_date, status, reactions_count
  ) VALUES
  (
    'I watched you read on that bench for a year',
    'Every morning before work I took the long way through the park. You were always on the same bench, always the same book, coffee going cold while you underlined sentences. I wanted to ask what you were reading. I wanted to say your laugh when the pigeons landed too close was the best part of my day. I never crossed those ten meters. Maybe you never noticed me at all — and that is the part that still hurts.',
    'confession', 'Ana', 'confession', 'purple',
    41.9981, 21.4254, 'Skopje City Park', NULL, 'anonymous', NULL, '2019-05-14', 'approved', 3
  ),
  (
    'I should have jumped in after you',
    'You were twelve. I was fifteen and too proud to look scared. You swam out far at Potpesh and the current pulled — I saw it before you did. I ran along the shore screaming your name instead of going in. A fisherman reached you first. That night Baba slapped me and I deserved it. You never mentioned it again. I am thirty-one now and I still dream of that water. I am sorry I let fear sit between us when you needed your brother.',
    'apology', 'Nikola', 'apology', 'blue',
    41.1200, 20.8010, 'Ohrid Lake', NULL, 'nickname', 'Goran', '2011-08-05', 'approved', 7
  ),
  (
    'We never said what the canyon meant',
    'That afternoon in the kayak you said Matka feels like a church without walls. I laughed because I did not know how to hold something that honest. Two weeks later you left for Vienna and I answered your last message with a thumbs-up emoji. I think about the echo off the stone — how sound comes back different than you sent it. That is us. I hope the Danube is kinder to you than I was.',
    'goodbye', 'Elena', 'goodbye', 'gray',
    41.9500, 21.3000, 'Matka Canyon', NULL, 'real_name', 'Stefan D.', '2018-06-18', 'approved', 5
  ),
  (
    'The snowman was the only thing we built together',
    'You worked double shifts in Skopje and came to Mavrovo exhausted, smelling of hospital soap and cigarettes. I was angry at fourteen because you missed my match. That weekend you still drove us up in the old Golf, made tea on a camping stove, and helped me roll the snowman even though your hands were cracked from bleach. I called it stupid. You named it mayor and took a photo I deleted later. I would give anything for that photo now.',
    'thank_you', 'Mama', 'thank_you', 'yellow',
    41.6500, 20.7300, 'Mavrovo', NULL, 'anonymous', NULL, '2016-01-20', 'approved', 2
  ),
  (
    'You walked Shirok Sokak like you owned the light',
    'It was April and you had that red coat from Tetovo, the one your sister sent from Switzerland. We shared one gelato because we were students and pretended it was enough. You told me your father wanted you to marry a dentist in Gostivar. I told you I would figure something out. I did not figure anything out. I let the year eat us. Sometimes I walk the same street and stand where the fountain used to be, hoping you might turn a corner. You never do.',
    'love', 'Arta', 'love', 'pink',
    41.0280, 21.3290, 'Bitola Shirok Sokak', NULL, 'nickname', 'Dardan', '2017-04-09', 'approved', 4
  ),
  (
    'We ran out of that hall like we were free',
    'Painted Mosque in the background, diplomas shaking in our hands, your mother crying in Albanian and my father in Macedonian and neither of them understanding each other but both understanding us. You were the first person who taught me that home can be a language you are still learning. When you moved to Prishtina I said we would visit every month. I visited twice. This letter is not to make myself feel better. It is to tell you that Tetovo square still smells like your cologne when I pass it at night.',
    'memory', 'Artan', 'memory', 'green',
    42.0100, 20.9714, 'Tetovo', NULL, 'real_name', 'Besnik K.', '2020-07-02', 'approved', 6
  ),
  (
    'The apples are still sour without you',
    'Markovi Kuli turned gold that evening and you told me about the year the harvest failed, how your mother hid bread in the mattress. I thought old stories were far away until they were not. You died in February before the trees woke up. I brought apples to the grave last autumn and could not finish them. Dad says grief is private. I think grief is public and we just pretend otherwise in Prilep.',
    'goodbye', 'Baba', 'goodbye', 'purple',
    41.3450, 21.5550, 'Prilep', NULL, 'anonymous', NULL, '1998-09-14', 'approved', 8
  ),
  (
    'The clouds were below us and you were still sad',
    'We drove up at four in the morning because you said you could not breathe in the flat. Ilinden monument white against the dark, wind that cuts through jackets. You stood on the wall and said nothing for an hour. I should have asked the right question. Instead I took a photo for Instagram. Three months later you stopped answering. If you read this somewhere: the view is still here. You can come back without explaining where you went.',
    'healing', 'Fatmir', 'healing', 'blue',
    41.3689, 21.2489, 'Kruševo', NULL, 'nickname', 'Ivana', '2022-05-30', 'approved', 9
  ),
  (
    'I chose Berlin over the lake',
    'We ate fish with our hands like children, grease on our wrists, stars coming out over the water. You said we could buy the small house near Star Dojran — fix it slowly, grow old loudly. I said I needed five years in Germany first, to send money back, to make it proper. Five became ten. You married someone who stayed. I send money still. It arrives empty. Dojran is glass when I visit alone. I see us in it and look away.',
    'regret', 'Marija', 'regret', 'red',
    41.2460, 22.7450, 'Dojran Lake', NULL, 'real_name', 'Petar N.', '2014-08-22', 'approved', 3
  ),
  (
    'You gave me a book when I had no money',
    'I was seventeen, pockets empty after helping my sister with rent. Your shop smelled of paper and the cinnamon tea you always offered but never charged for. I stood too long with a thin poetry book and you said take it, pay when life is kinder. I paid you seven years later and you had already closed the shop. The book is on my nightstand in Skopje. I read the same poem when I want to remember that Štip once felt like mercy.',
    'thank_you', 'Hajredin', 'thank_you', 'purple',
    41.7450, 22.1958, 'Štip', NULL, 'anonymous', NULL, '2012-11-03', 'approved', 1
  ),
  (
    'You fed me when I had forty denars',
    'It was January and the bus from Kumanovo was late and my wallet was stolen near the Stone Bridge. I stood at your window with forty denars and shame so thick I could taste it. You wrapped two bureks, hot, cheese running through the paper, and pushed an extra one across the counter without a word. I wanted to say my name. I wanted to say thank you in a language big enough. I never found your stall again after the renovation. I hope your hands are still warm.',
    'memory', 'The woman at the blue awning', 'memory', 'orange',
    41.9973, 21.4315, 'Skopje Old Bazaar', NULL, 'nickname', 'Besa', NULL, 'approved', 11
  ),
  (
    'We walked home singing off-key on New Year''s Eve',
    'The last bus left without us near Debar Maalo and we decided walking to Aerodrom at two in the morning was wisdom. You carried my shoes when the blisters broke. Simona lied to her parents on the phone and said we were at a study group. Viktor quoted poetry badly and we laughed until the Vardar sounded like applause. That night we promised to show up for each other. Life scattered us — Zurich, Dubai, a village near Strumica. I am writing to say the promise still stands on my side.',
    'love', 'Dragan, Simona, and Viktor', 'love', 'pink',
    41.9964, 21.4310, 'Skopje', NULL, 'anonymous', NULL, '2015-12-31', 'approved', 12
  ),
  (
    'Rain on the windows, your kitchen, our first dance',
    'Radio Skopje played something old and you said you did not know how to slow-dance in socks on linoleum. I said neither do I and we stepped on each other''s feet like teenagers though we were already twenty-six. The radiator clicked. Rain made the city small. I wanted to tell you that I had loved you since the protest on Macedonia Square when you shouted louder than the loudspeakers. I said nothing. We divorced kindly three years later. I still remember the song.',
    'love', 'Snežana', 'love', 'red',
    42.0010, 21.4090, 'Skopje', NULL, 'anonymous', NULL, '2018-02-14', 'approved', 15
  ),
  (
    'You said I belong here and I almost believed you',
    'First day at the firm near Karposh, new shoes biting my heels, hands shaking on the keyboard. You were not even my boss — you were the client who waited while I rebooted the laptop twice. You said calm down, everyone breaks things on day one, you belong here. Nobody had said that to me in Skopje before. I thought belonging was something you earned by leaving and returning with a foreign salary. I stayed. I am still here. You retired without me saying this properly.',
    'thank_you', 'Prof. Dimovski', 'thank_you', 'green',
    41.9830, 21.4560, 'Skopje', NULL, 'real_name', 'Marija S.', '2017-09-01', 'approved', 2
  ),
  (
    'You filmed me falling and we laughed until we cried',
    'Parking lot behind the hospital in Štip, ice like glass, coffee flying, my dignity gone in one second. You could have helped me up. Instead you filmed and wheezed so hard you sat on a car bumper. We watched the video seventeen times that night with rakija and tears. Last year you got sick and I held your hand in the same building I fell in front of. I never told you that video is still on my phone. I watch it when I need proof that joy can live next to pain.',
    'memory', 'Blagoj', 'memory', 'yellow',
    41.7350, 22.1900, 'Štip', NULL, 'nickname', 'Blagica', '2021-01-08', 'approved', 4
  );

  RAISE NOTICE 'Demo letters seeded successfully.';
END $$;
