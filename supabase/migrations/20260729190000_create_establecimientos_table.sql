CREATE TABLE public.establecimientos (
    id SERIAL PRIMARY KEY,
    tipo TEXT NOT NULL,           -- 'Seguridad', 'Salud', 'Educacion'
    nombre TEXT NOT NULL,         -- Ej: 'Comisaría 1ra'
    direccion TEXT,               -- Ej: 'Avenida Lastra y Sarmiento'
    telefono TEXT,                -- Opcional
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.establecimientos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on establecimientos" ON public.establecimientos
    FOR SELECT TO public USING (true);
