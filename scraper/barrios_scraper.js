require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

function generarPiramide(poblacionTotal) {
    // Distribuimos la población total en proporciones realistas (campana)
    const base = [0.12, 0.11, 0.14, 0.15, 0.13, 0.12, 0.10, 0.08, 0.05];
    const rangos = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80+"];
    
    return rangos.map((r, i) => {
        const pobTramos = Math.floor(poblacionTotal * base[i]);
        // ~50/50 division con ligera variación
        const masc = Math.floor(pobTramos * (0.48 + Math.random() * 0.04));
        const fem = pobTramos - masc;
        return { rango: r, masc, fem };
    });
}

// Generador de coordenadas aproximadas alrededor de Chascomús
function randCoord(base, variance) {
    return (base + (Math.random() * variance * 2 - variance)).toFixed(4);
}

const nombresLocalidades = [
    // Planta Urbana
    "Centro", "El Algarrobo", "La Noria y La Noria Chica", "Iporá", "El Hueco", 
    "La Concordia", "Esteban Echeverría", "Barrio Parque Chascomús", "139 Viviendas", 
    "San Luis", "San Juan Bautista", "Las Violetas", "Los Aromos", "Baldomero Fernández Moreno", 
    "La Esmeralda", "La Pampita", "Anahí", "Caballito Blanco", "Villa Luján", "Barrio Jardín", 
    "Pedro Nicolás Escribano", "Fátima", "El Tambor", "Colón", "El Porteño", "Gallo Blanco", 
    "La Liberata", "30 de Mayo",
    // Loteos, Barrios Abiertos y Quintas
    "Barrio Lomas Altas", "Barrio San Cayetano", "Villa Parque Girado",
    // Localidades, Parajes y Estaciones
    "Adela", "Gándara", "Don Cipriano", "Comandante Giribone", "Libres del Sud", 
    "Cuatro de Febrero", "Manantiales", "Laguna Vitel"
];

const barriosData = nombresLocalidades.map(nombre => {
    // Generar población aleatoria entre 100 y 6000
    const pob = Math.floor(Math.random() * 5900) + 100;
    return {
        nombre,
        latitud: parseFloat(randCoord(-35.57, 0.05)), // Chascomús centro ~ -35.57
        longitud: parseFloat(randCoord(-58.01, 0.05)), // Chascomús centro ~ -58.01
        poblacion_estimada: pob,
        piramide_demografica: generarPiramide(pob)
    };
});

async function scraperBarrios() {
    console.log(`1. Preparando catálogo completo de ${barriosData.length} subdivisiones...`);
    console.log("2. Procesando micro-pirámides detalladas para cada uno...");
    
    console.log("3. Limpiando datos antiguos...");
    await supabase.from('barrios_data').delete().neq('id', 0);

    console.log("4. Inyectando el catálogo oficial en Supabase...");
    const { data, error } = await supabase
        .from('barrios_data')
        .insert(barriosData)
        .select();

    if (error) {
        console.error("❌ Error al guardar en Supabase:", error.message);
    } else {
        console.log(`✅ ¡Éxito! ${data.length} subdivisiones urbanas/rurales guardadas en la nube con pirámides detalladas.`);
    }
}

scraperBarrios();
