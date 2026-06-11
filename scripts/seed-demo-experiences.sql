-- Demo experiences for Shared Experiences MK
-- Safe fictional stories for testing. Run in Supabase SQL Editor or: npm run seed:demo
-- Skips insert if demo data already exists.
-- Photos: real North Macedonia locations via Wikimedia Commons (CC / public domain).

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM experiences WHERE title = 'Morning light at Skopje City Park'
  ) THEN
    RAISE NOTICE 'Demo experiences already exist — skipping.';
    RETURN;
  END IF;

  INSERT INTO experiences (
    title, story, category, lat, lng, location_name,
    image_url, author_mode, author_name, memory_date, status, reactions_count
  ) VALUES
  (
    'Morning light at Skopje City Park',
    'We sat on a bench with hot coffee while the city slowly woke up. Nothing fancy — just quiet laughter, autumn leaves, and the feeling that life can be gentle.',
    'life_moment', 41.9981, 21.4254, 'Skopje City Park',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Gradski_park_-_panoramio.jpg/960px-Gradski_park_-_panoramio.jpg',
    'anonymous', NULL, '2024-10-12', 'approved', 3
  ),
  (
    'First swim in Ohrid Lake',
    'The water was so clear it felt unreal. My friends cheered from the shore while I floated and watched the mountains mirror the sky. Pure peace.',
    'nature', 41.1200, 20.8010, 'Ohrid Lake',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Ohrid_Kaneo.jpg/960px-Ohrid_Kaneo.jpg',
    'nickname', 'LakeWalker', '2023-08-05', 'approved', 7
  ),
  (
    'Kayaking through Matka Canyon',
    'The cliffs rose like cathedrals above us. We paddled slowly, listening to birds and water echo off the stone. One of the most beautiful afternoons of my life.',
    'travel', 41.9500, 21.3000, 'Matka Canyon',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Matka_canyon.jpg/960px-Matka_canyon.jpg',
    'real_name', 'Elena M.', '2022-06-18', 'approved', 5
  ),
  (
    'Snow day in Mavrovo',
    'Fresh snow, warm tea, and old songs in a small cabin. We built a tiny snowman and called it our mayor. Simple joy at its best.',
    'family', 41.6500, 20.7300, 'Mavrovo',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mavrovo_Lake.jpg/960px-Mavrovo_Lake.jpg',
    'anonymous', NULL, '2025-01-20', 'approved', 2
  ),
  (
    'Evening stroll on Shirok Sokak',
    'Bitola felt like a movie set — lights, music, couples walking hand in hand. I tried the best gelato in years and promised myself to return every spring.',
    'food', 41.0280, 21.3290, 'Bitola Shirok Sokak',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sirok_sokak.jpg/960px-Sirok_sokak.jpg',
    'nickname', 'SpringSoul', '2024-04-09', 'approved', 4
  ),
  (
    'Graduation hugs in Tetovo',
    'We ran out of the hall screaming, diplomas in hand, tears and laughter everywhere. Years of study ended with one long group hug on the main square.',
    'student_life', 42.0100, 20.9714, 'Tetovo',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Painted_Mosque_Tetovo.jpg/960px-Painted_Mosque_Tetovo.jpg',
    'real_name', 'Arben K.', '2021-07-02', 'approved', 6
  ),
  (
    'Sunset over Prilep',
    'From the hill, the whole valley turned gold. My grandmother told stories about her youth while we shared apples from the garden. Time felt soft and unhurried.',
    'family', 41.3450, 21.5550, 'Prilep',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Markovi_Kuli%2C_Prilep.jpg/960px-Markovi_Kuli%2C_Prilep.jpg',
    'anonymous', NULL, '2020-09-14', 'approved', 8
  ),
  (
    'Kruševo sky at dawn',
    'We woke before sunrise to see the clouds below us. The wind was cold but our hearts were warm. A memory I replay whenever life gets heavy.',
    'nature', 41.3689, 21.2489, 'Kruševo',
    'https://upload.wikimedia.org/wikipedia/commons/d/d5/Krusevo.jpg',
    'nickname', 'CloudChaser', '2023-05-30', 'approved', 9
  ),
  (
    'Quiet afternoon at Dojran Lake',
    'Fishermen waved from their boats, and the lake shimmered like glass. We ate fresh fish by the shore and talked until the stars appeared.',
    'food', 41.2460, 22.7450, 'Dojran Lake',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Dojran_Lake.jpg/960px-Dojran_Lake.jpg',
    'real_name', 'Nikola P.', '2022-08-22', 'approved', 3
  ),
  (
    'Hidden bookshop in Štip',
    'Tucked between two cafés, a tiny shop smelled of paper and cinnamon tea. The owner recommended a poetry book that still sits on my nightstand.',
    'hidden_gem', 41.7450, 22.1958, 'Štip',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C5%A0tip_20.JPG/960px-%C5%A0tip_20.JPG',
    'anonymous', NULL, '2024-11-03', 'approved', 1
  ),
  (
    'Try the burek on this corner',
    'If you are near the old bazaar, stop at the small bakery with the blue awning. Order cheese burek fresh from the oven — crisp, warm, unforgettable.',
    'recommendation', 41.9973, 21.4315, 'Skopje Old Bazaar',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Old_Bazaar%2C_Skopje.jpg/960px-Old_Bazaar%2C_Skopje.jpg',
    'nickname', 'FoodieMK', NULL, 'approved', 11
  ),
  (
    'Friends who became family',
    'We missed the last bus and walked home under streetlights, singing off-key. That night we decided we would always show up for each other. And we did.',
    'friendship', 41.9964, 21.4310, 'Skopje',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Stone_Bridge_Skopje.jpg/960px-Stone_Bridge_Skopje.jpg',
    'anonymous', NULL, '2019-12-31', 'approved', 12
  ),
  (
    'Our first dance',
    'Rain on the windows, a slow song from the radio, and two shy hearts finding courage on a tiny kitchen floor. It was imperfect and absolutely perfect.',
    'love', 42.0010, 21.4090, 'Skopje',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Skopje_panorama.jpg/960px-Skopje_panorama.jpg',
    'nickname', 'HeartNote', '2018-02-14', 'approved', 15
  ),
  (
    'The day I started my first job',
    'Nervous hands, new shoes, and a mentor who smiled and said, "You belong here." That sentence carried me through the whole first month.',
    'work', 41.9830, 21.4560, 'Skopje',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Skopje_2014.jpg/960px-Skopje_2014.jpg',
    'real_name', 'Marija S.', '2017-09-01', 'approved', 2
  ),
  (
    'Slipped on ice, laughed for an hour',
    'I fell spectacularly in the parking lot — coffee everywhere, dignity nowhere. My brother filmed it and we cried laughing for an hour. Best bad moment ever.',
    'funny_moment', 41.7350, 22.1900, 'Štip',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/%D0%9F%D0%BE%D0%B3%D0%BB%D0%B5%D0%B4_%D0%BD%D0%B0_%D0%B3%D1%80%D0%B0%D0%B4%D0%BE%D1%82_%D0%A8%D1%82%D0%B8%D0%BF.jpg/960px-%D0%9F%D0%BE%D0%B3%D0%BB%D0%B5%D0%B4_%D0%BD%D0%B0_%D0%B3%D1%80%D0%B0%D0%B4%D0%BE%D1%82_%D0%A8%D1%82%D0%B8%D0%BF.jpg',
    'nickname', 'ClumsyKing', '2024-01-08', 'approved', 4
  );

  RAISE NOTICE 'Demo experiences seeded successfully.';
END $$;
