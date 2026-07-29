CREATE TABLE public.autoridades_estado (
    id SERIAL PRIMARY KEY,
    poder TEXT NOT NULL,          -- 'Ejecutivo', 'Legislativo', 'Judicial'
    cargo TEXT NOT NULL,          -- 'Intendente', 'Concejal', 'Juez de Faltas', etc.
    nombre TEXT NOT NULL,         -- Nombre completo de la autoridad
    bloque_partido TEXT,          -- Afiliación política (opcional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.autoridades_estado ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on autoridades_estado" ON public.autoridades_estado
    FOR SELECT TO public USING (true);
