-- Transform all existing posts into unsent letters (message_to, message_type, emotion_color + letter copy)
-- Run via Supabase SQL editor or MCP execute_sql

UPDATE experiences SET
  message_to = 'The friend who never knew',
  message_type = 'memory',
  emotion_color = 'yellow',
  title = 'That quiet morning',
  story = 'We sat on a bench with hot coffee while the city slowly woke up. I never told you how safe I felt — autumn leaves, your laugh, and the feeling that life could be gentle.'
WHERE title = 'Morning light at Skopje City Park';

UPDATE experiences SET
  message_to = 'My younger self',
  message_type = 'memory',
  emotion_color = 'blue',
  title = 'I wish you could see this water',
  story = 'The lake was so clear it felt unreal. I floated and watched the mountains mirror the sky. I never wrote to tell you that peace exists — you just have to find the right shore.'
WHERE title = 'First swim in Ohrid Lake';

UPDATE experiences SET
  message_to = 'The canyon',
  message_type = 'memory',
  emotion_color = 'green',
  title = 'You held us in your silence',
  story = 'The cliffs rose like cathedrals above us. We paddled slowly, listening to birds and water echo off the stone. I never said thank you for that afternoon — one of the most beautiful of my life.'
WHERE title = 'Kayaking through Matka Canyon';

UPDATE experiences SET
  message_to = 'Dad',
  message_type = 'memory',
  emotion_color = 'yellow',
  title = 'Our snowman mayor',
  story = 'Fresh snow, warm tea, and old songs in a small cabin. We built a tiny snowman and called it our mayor. I never told you those simple days are the ones I return to when life gets heavy.'
WHERE title = 'Snow day in Mavrovo';

UPDATE experiences SET
  message_to = 'Myself',
  message_type = 'hope',
  emotion_color = 'orange',
  title = 'I will come back every spring',
  story = 'Bitola felt like a movie set — lights, music, couples walking hand in hand. I promised myself on that gelato-sweet evening that I would return. I''m still keeping that promise.'
WHERE title = 'Evening stroll on Shirok Sokak';

UPDATE experiences SET
  message_to = 'Everyone who made it through',
  message_type = 'thank_you',
  emotion_color = 'green',
  title = 'We survived the hall together',
  story = 'We ran out screaming, diplomas in hand, tears and laughter everywhere. Years of study ended with one long group hug on the main square. I never thanked you all for carrying me.'
WHERE title = 'Graduation hugs in Tetovo';

UPDATE experiences SET
  message_to = 'Grandma',
  message_type = 'memory',
  emotion_color = 'purple',
  title = 'The valley turned gold',
  story = 'From the hill, the whole valley turned gold. You told stories about your youth while we shared apples from the garden. Time felt soft and unhurried. I miss your voice on evenings like that.'
WHERE title = 'Sunset over Prilep';

UPDATE experiences SET
  message_to = 'My younger self',
  message_type = 'promise',
  emotion_color = 'blue',
  title = 'I replay this when life gets heavy',
  story = 'We woke before sunrise to see the clouds below us. The wind was cold but our hearts were warm. I never wrote to say: hold onto this. You will need it later.'
WHERE title = 'Kruševo sky at dawn';

UPDATE experiences SET
  message_to = 'The person I was that summer',
  message_type = 'memory',
  emotion_color = 'blue',
  title = 'The lake shimmered like glass',
  story = 'Fishermen waved from their boats, and we ate fresh fish by the shore. We talked until the stars appeared. I never told you that night changed how I see quiet places.'
WHERE title = 'Quiet afternoon at Dojran Lake';

UPDATE experiences SET
  message_to = 'The bookseller',
  message_type = 'thank_you',
  emotion_color = 'purple',
  title = 'You smelled of paper and cinnamon',
  story = 'Tucked between two cafés, your tiny shop felt like a secret. You recommended a poetry book that still sits on my nightstand. I never came back to say thank you.'
WHERE title = 'Hidden bookshop in Štip';

UPDATE experiences SET
  message_to = 'A stranger at the bazaar',
  message_type = 'memory',
  emotion_color = 'orange',
  title = 'I still think about that burek',
  story = 'If you ever pass the bakery with the blue awning — order the cheese burek fresh from the oven. I wanted to tell you it was the warmest kindness a stranger gave me that year.'
WHERE title = 'Try the burek on this corner';

UPDATE experiences SET
  message_to = 'My chosen family',
  message_type = 'love',
  emotion_color = 'pink',
  title = 'We missed the last bus',
  story = 'We walked home under streetlights, singing off-key. That night we decided we would always show up for each other. I never said it plainly: you became my family.'
WHERE title = 'Friends who became family';

UPDATE experiences SET
  message_to = 'You',
  message_type = 'love',
  emotion_color = 'red',
  title = 'Our first dance',
  story = 'Rain on the windows, a slow song from the radio, and two shy hearts finding courage on a tiny kitchen floor. It was imperfect and absolutely perfect. I never told you I still remember every step.'
WHERE title = 'Our first dance';

UPDATE experiences SET
  message_to = 'My mentor',
  message_type = 'thank_you',
  emotion_color = 'green',
  title = 'You said I belong here',
  story = 'Nervous hands, new shoes, and you smiled and said, "You belong here." That sentence carried me through the whole first month. I never wrote to tell you what it meant.'
WHERE title = 'The day I started my first job';

UPDATE experiences SET
  message_to = 'My brother',
  message_type = 'memory',
  emotion_color = 'yellow',
  title = 'Dignity nowhere, laughter everywhere',
  story = 'I fell spectacularly in the parking lot — coffee everywhere, dignity nowhere. You filmed it and we cried laughing for an hour. I never thanked you for turning shame into joy.'
WHERE title = 'Slipped on ice, laughed for an hour';

-- Catch-all for any remaining posts without message_to
UPDATE experiences SET
  message_to = COALESCE(message_to, 'Someone'),
  message_type = COALESCE(message_type, 'memory'),
  emotion_color = COALESCE(emotion_color, 'gray')
WHERE message_to IS NULL OR message_type IS NULL OR emotion_color IS NULL;
