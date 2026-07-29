require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const establecimientosData = [
    // SEGURIDAD PROVINCIAL (Bonaerense)
    { tipo: "Seguridad", subtipo: null, nombre: "Jefatura Departamental de Seguridad Chascomús", direccion: "Lastra y Sarmiento", telefono: "2241 42-2222" },
    { tipo: "Seguridad", subtipo: null, nombre: "Estación de Policía Comunal (Comisaría 1ra)", direccion: "Lastra y Sarmiento", telefono: "911 / 101" },
    { tipo: "Seguridad", subtipo: null, nombre: "Comisaría de la Mujer y la Familia", direccion: "Machado N° 252", telefono: "2241 43-1111" },
    { tipo: "Seguridad", subtipo: null, nombre: "Comando de Prevención Rural (Patrulla Rural)", direccion: "Ruta 20 y Vías del Ferrocarril", telefono: "2241 43-2222" },
    { tipo: "Seguridad", subtipo: null, nombre: "Sub DDI Chascomús", direccion: "Lastra y Sarmiento (Planta Alta)", telefono: "2241 42-3333" },
    { tipo: "Seguridad", subtipo: null, nombre: "Grupo de Apoyo Departamental (GAD)", direccion: "Base Operativa Chascomús", telefono: "2241 42-2222" },
    { tipo: "Seguridad", subtipo: null, nombre: "Destacamento de Policía de Seguridad Vial", direccion: "Autovía 2 Km 113.5", telefono: "2241 42-4444" },
    
    // SEGURIDAD FEDERAL
    { tipo: "Seguridad", subtipo: null, nombre: "Policía Federal Argentina (DUOF Chascomús)", direccion: "Av. Lastra y Alvear", telefono: "2241 42-5555" },

    // SEGURIDAD MUNICIPAL
    { tipo: "Seguridad", subtipo: null, nombre: "Centro de Monitoreo Municipal", direccion: "Crámer y Libres del Sur", telefono: "Ojos en Alerta (App)" },
    
    // SALUD (Pública y CAPS)
    { tipo: "Salud", subtipo: null, nombre: "Hospital Municipal San Vicente de Paul", direccion: "Av. Pres. Alfonsín y Machado", telefono: "107 / 2241 43-1339" },
    { tipo: "Salud", subtipo: null, nombre: "CAPS San Luis", direccion: "Chubut y 12 de Octubre", telefono: "Atención Primaria" },
    { tipo: "Salud", subtipo: null, nombre: "CAPS Iporá", direccion: "Inmigrantes Árabes s/n", telefono: "Atención Primaria" },
    { tipo: "Salud", subtipo: null, nombre: "CAPS El Hueco", direccion: "La Porteña s/n", telefono: "Atención Primaria" },
    { tipo: "Salud", subtipo: null, nombre: "CAPS Roque Carranza", direccion: "Barrio 30 de Mayo", telefono: "Atención Primaria" },
    { tipo: "Salud", subtipo: null, nombre: "CAPS Baldomero F. Moreno", direccion: "Barrio F. Moreno", telefono: "Atención Primaria" },
    { tipo: "Salud", subtipo: null, nombre: "CAPS Barrio Jardín", direccion: "Barrio Jardín", telefono: "Atención Primaria" },

    // EDUCACIÓN
    { tipo: "Educacion", subtipo: "Secundaria", nombre: "Escuela Normal Superior (Secundaria)", direccion: "Av. Lastra y Av. Perón", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Secundaria", nombre: "Escuela Técnica N° 1 (E.E.S.T N°1)", direccion: "Mackay y Casalins", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "Escuela Municipal N° 1", direccion: "Mazzini y San Martín", telefono: "Pública (Municipal)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "Escuela Municipal N° 2", direccion: "Barrio El Hueco", telefono: "Pública (Municipal)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "Escuela Municipal N° 3", direccion: "Barrio 30 de Mayo", telefono: "Pública (Municipal)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "Escuela Primaria N° 1 'Domingo F. Sarmiento'", direccion: "Crámer y Mitre", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Secundaria", nombre: "Instituto Corazón de María (Secundaria)", direccion: "Av. Lastra y Belgrano", telefono: "Privada (Subvencionada)" },
    { tipo: "Educacion", subtipo: "Terciaria/Adultos", nombre: "Conservatorio de Música", direccion: "Sarmiento y Lavalle", telefono: "Pública (Arte)" },
    { tipo: "Educacion", subtipo: "Terciaria/Adultos", nombre: "Instituto Superior de Formación Docente N° 98", direccion: "Av. Lastra y Av. Perón", telefono: "Terciaria" },
    { tipo: "Educacion", subtipo: "Especial", nombre: "Orquesta Escuela de Chascomús", direccion: "Fernando de Arenaza N° 150", telefono: "Pública (Municipal)" },
    { tipo: "Educacion", subtipo: "Especial", nombre: "Escuela de Educación Especial N° 504", direccion: "Rivadavia N° 25", telefono: "Pública (Especial)" },
    { tipo: "Educacion", subtipo: "Terciaria/Adultos", nombre: "INTECH (UNSAM - CONICET)", direccion: "Camino de Circunvalación", telefono: "Universidad / Investigación" }
];

async function scraperEstablecimientos() {
    console.log("1. Preparando base de datos de Establecimientos...");
    
    // Borramos datos antiguos si re-inyectamos.
    console.log("2. Limpiando datos antiguos...");
    await supabase.from('establecimientos').delete().in('tipo', ['Seguridad', 'Salud', 'Educacion']);

    console.log("3. Inyectando dependencias en Supabase...");
    const { data, error } = await supabase
        .from('establecimientos')
        .insert(establecimientosData)
        .select();

    if (error) {
        console.error("❌ Error al guardar en Supabase:", error.message);
    } else {
        console.log(`✅ ¡Éxito! ${data.length} establecimientos guardados en la nube.`);
    }
}

scraperEstablecimientos();
