CREATE TABLE public.demografia (
    id SERIAL PRIMARY KEY,
    poblacion TEXT NOT NULL,
    superficie TEXT NOT NULL,
    intendente TEXT NOT NULL,
    fundacion TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) and add a policy for public read access
ALTER TABLE public.demografia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.demografia
    FOR SELECT
    TO public
    USING (true);
