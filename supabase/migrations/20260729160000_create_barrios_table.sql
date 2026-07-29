CREATE TABLE public.barrios_data (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    latitud NUMERIC NOT NULL,
    longitud NUMERIC NOT NULL,
    poblacion_estimada INTEGER NOT NULL,
    piramide_demografica JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.barrios_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on barrios_data" ON public.barrios_data
    FOR SELECT TO public USING (true);
