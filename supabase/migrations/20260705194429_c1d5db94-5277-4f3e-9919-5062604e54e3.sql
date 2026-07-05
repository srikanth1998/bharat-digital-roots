
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';
UPDATE public.members SET status = 'approved' WHERE user_id IS NOT NULL AND status = 'pending';
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'members_status_check') THEN
    ALTER TABLE public.members ADD CONSTRAINT members_status_check CHECK (status IN ('pending','approved','rejected'));
  END IF;
END $$;
ALTER TABLE public.members ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.members ALTER COLUMN amount_inr SET DEFAULT 0;
CREATE INDEX IF NOT EXISTS members_status_idx ON public.members(status);
