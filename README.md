# Observatorio de Datos Abiertos de Chascomús 🏛️📊

Plataforma ciudadana interactiva diseñada para transparentar la información demográfica, institucional y de infraestructura pública de la ciudad de Chascomús (Buenos Aires, Argentina).

## 🎯 Objetivo
El objetivo principal de este observatorio es centralizar datos públicos dispersos y presentarlos de forma amigable, accesible y estructurada. Busca empoderar al ciudadano brindándole herramientas visuales (Dashboard) para:
- **Demografía:** Conocer la proyección poblacional, densidad y distribución por rangos etarios.
- **Transparencia Institucional:** Visualizar la nómina completa de autoridades a cargo de los tres poderes del Estado (Ejecutivo, Legislativo y Judicial), así como del Consejo Escolar, con detalle de cargos y comisiones.
- **Infraestructura y Servicios:** Mapear la red troncal de servicios esenciales (Comisarías, Hospitales, CAPS y Escuelas), incluyendo direcciones físicas y teléfonos de contacto rápido.

## 🛠️ Metodología y Arquitectura
Este proyecto fue construido utilizando la metodología **SHDD (Specification & Harness Driven Development)** con asistencia de inteligencia artificial (Antigravity).

La arquitectura se divide en dos capas principales:
1. **Frontend (Capa de Presentación):** 
   - Desarrollado en **React** con **Vite**.
   - Estilizado con CSS nativo moderno (Glassmorphism, Dark Mode) y componentes visuales de `lucide-react`.
   - Ubicado en la carpeta `/web`.
2. **Backend & Base de Datos:**
   - **Supabase** (PostgreSQL) como motor de base de datos en la nube.
   - Scripts inyectores (Scrapers) desarrollados en **Node.js** para poblar las tablas maestras de autoridades, demografía y establecimientos de forma programática.
   - Ubicado en las carpetas `/supabase` y `/scraper`.

## 🚀 Despliegue (Hosting)
El frontend está optimizado para ser alojado en plataformas serverless como **Vercel**. 
Al estar construido dentro de un monorepo, para desplegarlo correctamente en Vercel se debe configurar el proyecto de la siguiente manera:
- **Framework Preset:** Vite
- **Root Directory:** `web`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Variables de Entorno (.env)
Para el correcto funcionamiento en producción, se deben proveer las siguientes variables de entorno al frontend:
```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

## 📜 Licencia
Proyecto de código abierto desarrollado para el beneficio de la comunidad. Total transparencia y libre utilización de datos (Open Data).
