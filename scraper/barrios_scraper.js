require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Simulación de datos extraídos (Barrios de Chascomús)
const barriosData = [
    {
        nombre: "Barrio San Luis",
        latitud: -35.5802,
        longitud: -58.0125,
        poblacion_estimada: 4200,
        piramide_demografica: [
            { rango: "0-14", masc: 400, fem: 410 },
            { rango: "15-64", masc: 1400, fem: 1500 },
            { rango: "65+", masc: 200, fem: 290 }
        ]
    },
    {
        nombre: "Barrio El Hueco",
        latitud: -35.5689,
        longitud: -58.0055,
        poblacion_estimada: 3100,
        piramide_demografica: [
            { rango: "0-14", masc: 350, fem: 330 },
            { rango: "15-64", masc: 1000, fem: 1050 },
            { rango: "65+", masc: 150, fem: 220 }
        ]
    },
    {
        nombre: "Barrio Iporá",
        latitud: -35.5841,
        longitud: -58.0210,
        poblacion_estimada: 5800,
        piramide_demografica: [
            { rango: "0-14", masc: 650, fem: 620 },
            { rango: "15-64", masc: 1900, fem: 1950 },
            { rango: "65+", masc: 310, fem: 370 }
        ]
    },
    {
        nombre: "Barrio San Cayetano",
        latitud: -35.5711,
        longitud: -57.9944,
        poblacion_estimada: 2500,
        piramide_demografica: [
            { rango: "0-14", masc: 250, fem: 260 },
            { rango: "15-64", masc: 800, fem: 840 },
            { rango: "65+", masc: 160, fem: 190 }
        ]
    }
];

async function scraperBarrios() {
    console.log("1. Obteniendo cartografía y datos barriales...");
    console.log("2. Procesando micro-pirámides (JSONB)...");
    
    console.log("3. Limpiando datos antiguos...");
    await supabase.from('barrios_data').delete().neq('id', 0); // Borra todo para evitar dupes

    console.log("4. Inyectando barrios en Supabase...");
    const { data, error } = await supabase
        .from('barrios_data')
        .insert(barriosData)
        .select();

    if (error) {
        console.error("❌ Error al guardar en Supabase:", error.message);
    } else {
        console.log(`✅ ¡Éxito! ${data.length} barrios guardados en la nube con sus pirámides.`);
    }
}

scraperBarrios();
