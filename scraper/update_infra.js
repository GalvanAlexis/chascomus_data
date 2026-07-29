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
            hospitales_total: 8,      // Municipal + Clínica + CAPS
            comisarias_total: 9       // Comisaría 1, Mujer, DDI, Rural, Departamental, GAD, Vial, Federal, Monitoreo
        })
        .neq('id', 0); // Hack para actualizar todas las filas (que es 1)

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("✅ Infraestructura actualizada correctamente.");
    }
}

updateInfra();
