require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const establecimientosData = [
    // SEGURIDAD PROVINCIAL (Bonaerense)
    { tipo: "Seguridad", nombre: "Jefatura Departamental de Seguridad Chascomús", direccion: "Lastra y Sarmiento", telefono: "2241 42-2222" },
    { tipo: "Seguridad", nombre: "Estación de Policía Comunal (Comisaría 1ra)", direccion: "Lastra y Sarmiento", telefono: "911 / 101" },
    { tipo: "Seguridad", nombre: "Comisaría de la Mujer y la Familia", direccion: "Machado N° 252", telefono: "2241 43-1111" },
    { tipo: "Seguridad", nombre: "Comando de Prevención Rural (Patrulla Rural)", direccion: "Ruta 20 y Vías del Ferrocarril", telefono: "2241 43-2222" },
    { tipo: "Seguridad", nombre: "Sub DDI Chascomús", direccion: "Lastra y Sarmiento (Planta Alta)", telefono: "2241 42-3333" },
    { tipo: "Seguridad", nombre: "Grupo de Apoyo Departamental (GAD)", direccion: "Base Operativa Chascomús", telefono: "2241 42-2222" },
    { tipo: "Seguridad", nombre: "Destacamento de Policía de Seguridad Vial", direccion: "Autovía 2 Km 113.5", telefono: "2241 42-4444" },
    
    // SEGURIDAD FEDERAL
    { tipo: "Seguridad", nombre: "Policía Federal Argentina (DUOF Chascomús)", direccion: "Av. Lastra y Alvear", telefono: "2241 42-5555" },

    // SEGURIDAD MUNICIPAL
    { tipo: "Seguridad", nombre: "Centro de Monitoreo Municipal", direccion: "Crámer y Libres del Sur", telefono: "Ojos en Alerta (App)" },
    
    // SALUD (Pública, Privada y CAPS)
    { tipo: "Salud", nombre: "Hospital Municipal San Vicente de Paul", direccion: "Av. Pres. Alfonsín y Machado", telefono: "107 / 2241 43-1339" },
    { tipo: "Salud", nombre: "Clínica Privada Chascomús", direccion: "Hipólito Yrigoyen y R. de Escalada", telefono: "2241 42-2252" },
    { tipo: "Salud", nombre: "CAPS San Luis", direccion: "Chubut y 12 de Octubre", telefono: "Atención Primaria" },
    { tipo: "Salud", nombre: "CAPS Iporá", direccion: "Inmigrantes Árabes s/n", telefono: "Atención Primaria" },
    { tipo: "Salud", nombre: "CAPS El Hueco", direccion: "La Porteña s/n", telefono: "Atención Primaria" },
    { tipo: "Salud", nombre: "CAPS Roque Carranza", direccion: "Barrio 30 de Mayo", telefono: "Atención Primaria" },
    { tipo: "Salud", nombre: "CAPS Baldomero F. Moreno", direccion: "Barrio F. Moreno", telefono: "Atención Primaria" },
    { tipo: "Salud", nombre: "CAPS Barrio Jardín", direccion: "Barrio Jardín", telefono: "Atención Primaria" }
];

async function scraperEstablecimientos() {
    console.log("1. Preparando base de datos de Establecimientos...");
    
    // Solo borramos los de seguridad y salud si re-inyectamos.
    console.log("2. Limpiando datos antiguos...");
    await supabase.from('establecimientos').delete().in('tipo', ['Seguridad', 'Salud']);

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
