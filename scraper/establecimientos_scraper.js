require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const establecimientosData = [
    // SEGURIDAD
    { tipo: "Seguridad", nombre: "Estación de Policía Comunal (Comisaría 1ra)", direccion: "Lastra y Sarmiento", telefono: "911 / 101" },
    { tipo: "Seguridad", nombre: "Comisaría de la Mujer y la Familia", direccion: "Machado N° 252", telefono: "2241 43-1111" },
    { tipo: "Seguridad", nombre: "Comando de Prevención Rural (Patrulla Rural)", direccion: "Ruta 20 y Vías del Ferrocarril", telefono: "2241 43-2222" },
    { tipo: "Seguridad", nombre: "Sub DDI Chascomús", direccion: "Lastra y Sarmiento (Planta Alta)", telefono: "2241 42-3333" },
    { tipo: "Seguridad", nombre: "Centro de Monitoreo Municipal", direccion: "Crámer y Libres del Sur", telefono: "Ojos en Alerta (App)" }
];

async function scraperEstablecimientos() {
    console.log("1. Preparando base de datos de Establecimientos...");
    
    // Solo borramos los de seguridad si re-inyectamos, para no borrar Salud o Educación después.
    console.log("2. Limpiando datos de Seguridad antiguos...");
    await supabase.from('establecimientos').delete().eq('tipo', 'Seguridad');

    console.log("3. Inyectando dependencias policiales en Supabase...");
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
