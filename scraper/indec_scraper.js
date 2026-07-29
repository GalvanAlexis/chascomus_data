require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Simulación de la API del INDEC / DPE (Proyección 2026 - Chascomús)
// Pirámide poblacional básica
const datosINDEC = [
    { rango_etario: "0-14 años", poblacion_masculina: 4800, poblacion_femenina: 4750, ano_proyeccion: 2026 },
    { rango_etario: "15-64 años", poblacion_masculina: 13500, poblacion_femenina: 14100, ano_proyeccion: 2026 },
    { rango_etario: "65+ años", poblacion_masculina: 2100, poblacion_femenina: 3202, ano_proyeccion: 2026 }
];

async function scraperINDEC() {
    console.log("1. Obteniendo datos proyectados de INDEC / DPE para Chascomús...");
    
    // Aquí iría la lógica de fetch a un CSV real del INDEC
    // simularemos el parsing
    console.log("2. Procesando pirámide poblacional...");
    
    console.log("3. Limpiando datos antiguos de 2026 (para no duplicar)...");
    await supabase.from('indec_proyecciones').delete().eq('ano_proyeccion', 2026);

    console.log("4. Inyectando datos demográficos en Supabase...");
    const { data, error } = await supabase
        .from('indec_proyecciones')
        .insert(datosINDEC)
        .select();

    if (error) {
        console.error("❌ Error al guardar en Supabase:", error.message);
    } else {
        console.log(`✅ ¡Éxito! ${data.length} rangos etarios guardados en la nube.`);
        console.log(data);
    }
}

scraperINDEC();
