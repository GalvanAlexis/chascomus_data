require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function updateInfra() {
    console.log("Actualizando métricas de infraestructura...");
    
    // Suponemos que solo hay 1 fila en 'demografia' para Chascomús
    const { data, error } = await supabase
        .from('demografia')
        .update({
            escuelas_total: 62,       // Jardines, primarias, secundarias
            hospitales_total: 2,      // Municipal + Clínica
            comisarias_total: 4       // Comisaría 1, Mujer, DDI, Rural
        })
        .neq('id', 0); // Hack para actualizar todas las filas (que es 1)

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("✅ Infraestructura actualizada correctamente.");
    }
}

updateInfra();
