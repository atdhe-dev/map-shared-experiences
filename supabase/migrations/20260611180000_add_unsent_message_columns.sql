-- Unsent messages concept: recipient, type, and emotion color
ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS message_to text,
  ADD COLUMN IF NOT EXISTS message_type text,
  ADD COLUMN IF NOT EXISTS emotion_color text;

COMMENT ON COLUMN public.experiences.message_to IS 'Recipient of the unsent message';
COMMENT ON COLUMN public.experiences.message_type IS 'love, apology, goodbye, thank_you, confession, memory, promise, regret, hope, for_myself, other';
COMMENT ON COLUMN public.experiences.emotion_color IS 'red, blue, yellow, green, purple, pink, orange, black, white, gray';
