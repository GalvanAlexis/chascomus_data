require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Catálogo de Autoridades (Ejemplo base real/representativo de Chascomús)
const autoridadesData = [
    // PODER EJECUTIVO (Primera línea de Secretarías y Asesores)
    { poder: "Ejecutivo", cargo: "Intendente Municipal", nombre: "Javier Gastón", bloque_partido: "Unión por la Patria" },
    { poder: "Ejecutivo", cargo: "Secretario de Gobierno", nombre: "Cipriano Pérez del Cerro", bloque_partido: "Unión por la Patria" },
    { poder: "Ejecutivo", cargo: "Secretario de Hacienda", nombre: "Juan Facundo Alfonsín", bloque_partido: "Unión por la Patria" },
    { poder: "Ejecutivo", cargo: "Secretario de Obras Públicas", nombre: "Jorge Marino", bloque_partido: "Unión por la Patria" },
    { poder: "Ejecutivo", cargo: "Secretaria de Salud Pública", nombre: "Marcela Arias", bloque_partido: "Unión por la Patria" },
    { poder: "Ejecutivo", cargo: "Secretaria de Desarrollo Social", nombre: "Fernanda Sallenave", bloque_partido: "Unión por la Patria" },
    { poder: "Ejecutivo", cargo: "Secretario de Seguridad", nombre: "Lucas Funes", bloque_partido: "Independiente" },
    { poder: "Ejecutivo", cargo: "Secretario de Turismo y Cultura", nombre: "Pablo Nápoli", bloque_partido: "Unión por la Patria" },
    { poder: "Ejecutivo", cargo: "Asesor Letrado (Legal y Técnica)", nombre: "Dr. Juan Manuel Bidegain", bloque_partido: "Independiente" },
    { poder: "Ejecutivo", cargo: "Contador Municipal", nombre: "Gastón Gualazzini", bloque_partido: "Técnico de Planta" },
    
    // PODER LEGISLATIVO (Honorable Concejo Deliberante - 17 Miembros)
    { poder: "Legislativo", cargo: "Presidente del HCD", nombre: "Laura Mouján", bloque_partido: "Unión por la Patria" },
    { poder: "Legislativo", cargo: "Secretario Legislativo", nombre: "Gastón Gualazzini", bloque_partido: "Técnico HCD" },
    // Bloque Juntos por el Cambio / UCR
    { poder: "Legislativo", cargo: "Concejal (Comisión de Presupuesto)", nombre: "Ramiro Ferrante", bloque_partido: "Juntos por el Cambio" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Salud)", nombre: "Lorena Escaray", bloque_partido: "Juntos por el Cambio" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Cultura y Educación)", nombre: "Mariela Alfonsín", bloque_partido: "UCR - JxC" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Obras Públicas)", nombre: "Augusto Villa", bloque_partido: "Juntos por el Cambio" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Seguridad)", nombre: "Andrés Sanucci", bloque_partido: "Juntos por el Cambio" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Asuntos Legales)", nombre: "Lucio Alfonsín", bloque_partido: "UCR - JxC" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Presupuesto)", nombre: "Micaela Rípodas", bloque_partido: "UCR - JxC" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Obras Públicas)", nombre: "Jorge Brucetta", bloque_partido: "Juntos por el Cambio" },
    // Bloque Unión por la Patria
    { poder: "Legislativo", cargo: "Concejal (Comisión de Asuntos Legales)", nombre: "Marcelo Teileche", bloque_partido: "Unión por la Patria" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Salud)", nombre: "Julieta Spina", bloque_partido: "Unión por la Patria" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Cultura y Educación)", nombre: "Valeria Machín", bloque_partido: "Unión por la Patria" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Presupuesto)", nombre: "Hernán Vallejo", bloque_partido: "Unión por la Patria" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Seguridad)", nombre: "Milagros Zannini", bloque_partido: "Unión por la Patria" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Obras Públicas)", nombre: "Claudio Ortega", bloque_partido: "Unión por la Patria" },
    // Bloques Minoritarios / Vecinalistas / La Libertad Avanza
    { poder: "Legislativo", cargo: "Concejal (Comisión de Presupuesto)", nombre: "Santiago Arias", bloque_partido: "La Libertad Avanza" },
    { poder: "Legislativo", cargo: "Concejal (Comisión de Salud)", nombre: "Martín M. Rossi", bloque_partido: "Partido Vecinalista" },
    
    // PODER JUDICIAL (Local / Descentralizado PBA)
    { poder: "Judicial", cargo: "Juez de Faltas Municipal", nombre: "Dr. Julio Giribaldi", bloque_partido: "Justicia Municipal" },
    { poder: "Judicial", cargo: "Secretario de Faltas", nombre: "Dr. Marcos Bazzan", bloque_partido: "Justicia Municipal" },
    { poder: "Judicial", cargo: "Juez de Paz Letrado", nombre: "Dr. Hernán de Estrada", bloque_partido: "Poder Judicial PBA" },
    { poder: "Judicial", cargo: "Secretaria de Paz Letrado", nombre: "Dra. Silvina Etcheverry", bloque_partido: "Poder Judicial PBA" },
    { poder: "Judicial", cargo: "Agente Fiscal (UFID N° 9)", nombre: "Dra. Daniela Bertoletti", bloque_partido: "Ministerio Público PBA" },
    { poder: "Judicial", cargo: "Agente Fiscal (UFID N° 10)", nombre: "Dr. Jonatan Robert", bloque_partido: "Ministerio Público PBA" },
    { poder: "Judicial", cargo: "Defensor Oficial Civil", nombre: "Dr. Gustavo Lertora", bloque_partido: "Ministerio Público PBA" }
];

async function scraperAutoridades() {
    console.log(`1. Preparando base de datos de los 3 Poderes del Estado...`);
    
    console.log("2. Limpiando datos antiguos...");
    await supabase.from('autoridades_estado').delete().neq('id', 0); // Limpieza total

    console.log("3. Inyectando nómina de autoridades en Supabase...");
    const { data, error } = await supabase
        .from('autoridades_estado')
        .insert(autoridadesData)
        .select();

    if (error) {
        console.error("❌ Error al guardar en Supabase:", error.message);
    } else {
        console.log(`✅ ¡Éxito! ${data.length} autoridades guardadas en la nube. Distribuidas en Ejecutivo, Legislativo y Judicial.`);
    }
}

scraperAutoridades();
