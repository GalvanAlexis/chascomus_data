CREATE TABLE public.indec_proyecciones (
    id SERIAL PRIMARY KEY,
    rango_etario TEXT NOT NULL,
    poblacion_masculina INTEGER NOT NULL,
    poblacion_femenina INTEGER NOT NULL,
    ano_proyeccion INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.indec_proyecciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on indec_proyecciones" ON public.indec_proyecciones
    FOR SELECT TO public USING (true);
