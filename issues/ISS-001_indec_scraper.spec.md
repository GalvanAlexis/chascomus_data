# ISS-001: Scraper Demográfico (INDEC / DPE)

Este contrato define la implementación del motor de extracción para datos demográficos detallados (Vector 1), aislándolo del resto de la aplicación.

### 🎯 Target Files Permitidos
Lista blanca estricta de archivos que el sub-agente tiene permiso de modificar o crear:
- [NEW] scraper/indec_scraper.js
- [NEW] supabase/migrations/20260729150500_create_indec_table.sql
- [MODIFY] scraper/package.json (solo si necesita dependencias extra como `csv-parser`)

### 🚫 Acciones Prohibidas (Guardrails)
- Prohibido tocar la carpeta `web/` o `docs/`.
- Prohibido modificar el archivo `.env` o exponer credenciales en el código fuente. Las variables `SUPABASE_URL` y `SUPABASE_KEY` ya existen en el entorno.
- Prohibido ejecutar comandos locales de pruebas no deterministas.

### 📝 Especificación Técnica
1. **Migración SQL:** Crea una tabla `indec_proyecciones` con los campos: `id`, `rango_etario`, `poblacion_masculina`, `poblacion_femenina`, `año_proyeccion`. Añade políticas RLS (lectura pública).
2. **Scraper Script:** Escribe el archivo `indec_scraper.js` en Node.js. Debe conectarse a Supabase usando `@supabase/supabase-js`. Debe generar datos estadísticos realistas para Chascomús (simulando la respuesta del INDEC para los rangos 0-14, 15-64, 65+ en el año actual) e insertarlos en la nueva tabla `indec_proyecciones`.

### 🧪 Quality Gate Determinista
El sub-agente debe asegurarse de que el script corra sin errores de sintaxis o conexión (la base local no está corriendo en el subagente, así que el test será solo de sintaxis).
`node --check scraper/indec_scraper.js`
