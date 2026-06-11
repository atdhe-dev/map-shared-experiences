-- Real North Macedonia location photos (Wikimedia Commons, freely licensed)
-- Run in Supabase SQL Editor to add photos to demo pins and fill missing images.

UPDATE experiences SET image_url = CASE title
  WHEN 'Morning light at Skopje City Park' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Gradski_park_-_panoramio.jpg/960px-Gradski_park_-_panoramio.jpg'
  WHEN 'First swim in Ohrid Lake' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Ohrid_Kaneo.jpg/960px-Ohrid_Kaneo.jpg'
  WHEN 'Kayaking through Matka Canyon' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Matka_canyon.jpg/960px-Matka_canyon.jpg'
  WHEN 'Snow day in Mavrovo' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mavrovo_Lake.jpg/960px-Mavrovo_Lake.jpg'
  WHEN 'Evening stroll on Shirok Sokak' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sirok_sokak.jpg/960px-Sirok_sokak.jpg'
  WHEN 'Graduation hugs in Tetovo' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Painted_Mosque_Tetovo.jpg/960px-Painted_Mosque_Tetovo.jpg'
  WHEN 'Sunset over Prilep' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Markovi_Kuli%2C_Prilep.jpg/960px-Markovi_Kuli%2C_Prilep.jpg'
  WHEN 'Kruševo sky at dawn' THEN
    'https://upload.wikimedia.org/wikipedia/commons/d/d5/Krusevo.jpg'
  WHEN 'Quiet afternoon at Dojran Lake' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Dojran_Lake.jpg/960px-Dojran_Lake.jpg'
  WHEN 'Hidden bookshop in Štip' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C5%A0tip_20.JPG/960px-%C5%A0tip_20.JPG'
  WHEN 'Try the burek on this corner' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Old_Bazaar%2C_Skopje.jpg/960px-Old_Bazaar%2C_Skopje.jpg'
  WHEN 'Friends who became family' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Stone_Bridge_Skopje.jpg/960px-Stone_Bridge_Skopje.jpg'
  WHEN 'Our first dance' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Skopje_panorama.jpg/960px-Skopje_panorama.jpg'
  WHEN 'The day I started my first job' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Skopje_2014.jpg/960px-Skopje_2014.jpg'
  WHEN 'Slipped on ice, laughed for an hour' THEN
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/%D0%9F%D0%BE%D0%B3%D0%BB%D0%B5%D0%B4_%D0%BD%D0%B0_%D0%B3%D1%80%D0%B0%D0%B4%D0%BE%D1%82_%D0%A8%D1%82%D0%B8%D0%BF.jpg/960px-%D0%9F%D0%BE%D0%B3%D0%BB%D0%B5%D0%B4_%D0%BD%D0%B0_%D0%B3%D1%80%D0%B0%D0%B4%D0%BE%D1%82_%D0%A8%D1%82%D0%B8%D0%BF.jpg'
END
WHERE title IN (
  'Morning light at Skopje City Park',
  'First swim in Ohrid Lake',
  'Kayaking through Matka Canyon',
  'Snow day in Mavrovo',
  'Evening stroll on Shirok Sokak',
  'Graduation hugs in Tetovo',
  'Sunset over Prilep',
  'Kruševo sky at dawn',
  'Quiet afternoon at Dojran Lake',
  'Hidden bookshop in Štip',
  'Try the burek on this corner',
  'Friends who became family',
  'Our first dance',
  'The day I started my first job',
  'Slipped on ice, laughed for an hour'
);

-- Fill any remaining pins without photos using location hints
UPDATE experiences SET image_url =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Gradski_park_-_panoramio.jpg/960px-Gradski_park_-_panoramio.jpg'
WHERE image_url IS NULL AND location_name ILIKE '%Skopje City Park%';

UPDATE experiences SET image_url =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Gevgelija.jpg/960px-Gevgelija.jpg'
WHERE image_url IS NULL AND location_name ILIKE '%Gevgelija%';

UPDATE experiences SET image_url =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Skopje_panorama.jpg/960px-Skopje_panorama.jpg'
WHERE image_url IS NULL AND location_name ILIKE '%Skopje%';
