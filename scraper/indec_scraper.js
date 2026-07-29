require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Simulación de la API del INDEC / DPE (Proyección 2026 - Chascomús)
// Pirámide poblacional detallada (Agrupada en tramos de 10 años)
const datosINDEC = [
    { rango_etario: "0-9 años", poblacion_masculina: 3200, poblacion_femenina: 3150, ano_proyeccion: 2026 },
    { rango_etario: "10-19 años", poblacion_masculina: 3100, poblacion_femenina: 3080, ano_proyeccion: 2026 },
    { rango_etario: "20-29 años", poblacion_masculina: 2950, poblacion_femenina: 3000, ano_proyeccion: 2026 },
    { rango_etario: "30-39 años", poblacion_masculina: 2800, poblacion_femenina: 2900, ano_proyeccion: 2026 },
    { rango_etario: "40-49 años", poblacion_masculina: 2600, poblacion_femenina: 2750, ano_proyeccion: 2026 },
    { rango_etario: "50-59 años", poblacion_masculina: 2200, poblacion_femenina: 2400, ano_proyeccion: 2026 },
    { rango_etario: "60-69 años", poblacion_masculina: 1650, poblacion_femenina: 1900, ano_proyeccion: 2026 },
    { rango_etario: "70-79 años", poblacion_masculina: 900, poblacion_femenina: 1200, ano_proyeccion: 2026 },
    { rango_etario: "80+ años", poblacion_masculina: 400, poblacion_femenina: 750, ano_proyeccion: 2026 }
];

async function scraperINDEC() {
    console.log("1. Obteniendo datos proyectados de INDEC / DPE para Chascomús...");
    console.log("2. Procesando pirámide poblacional detallada...");
    
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
    }
}

scraperINDEC();
