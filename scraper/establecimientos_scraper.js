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

    // EDUCACIÓN - PRIMARIAS PROVINCIALES URBANAS
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 1 'Bernardino Rivadavia'", direccion: "San Martín 77", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 2 'Domingo Faustino Sarmiento'", direccion: "Franklin 166", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 3 'Sargento Cabral'", direccion: "Julián Quintana 758", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 5 'Abanderado Lastra'", direccion: "L. Del Sur 527", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 8 'General San Martín'", direccion: "Comparte predio con CEC N° 802", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 9 'Remedios de Escalada'", direccion: "Bahía Blanca 118", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 17 'Comandante Jacinto Machado'", direccion: "Machado y Belbeze 246", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 31 'Deán Gregorio Funes'", direccion: "Las Nazarenas y La Gueya", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 55 'Bandera Nacional'", direccion: "Av. Pres. Alfonsín 588", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "Escuela Normal Superior 'Prof. Manuel Almada' (Nivel Primario)", direccion: "Av. Lastra y Av. Perón", telefono: "Pública (Provincial)" },

    // EDUCACIÓN - PRIMARIAS MUNICIPALES (Jornada Completa)
    { tipo: "Educacion", subtipo: "Primaria", nombre: "Escuela Municipal N° 1 'Juan Galo de Lavalle'", direccion: "San Martín 45", telefono: "Pública (Municipal)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "Escuela Municipal N° 2 'Hipólito Bouchard'", direccion: "Alvear 1160 (Acceso Norte)", telefono: "Pública (Municipal)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "Escuela Municipal N° 3 'Federico W. Gándara'", direccion: "Inmigrantes Árabes 395", telefono: "Pública (Municipal)" },

    // EDUCACIÓN - PRIMARIAS RURALES
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 4", direccion: "Paraje 'Los Jagüeles'", telefono: "Pública (Rural)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 7 'Manuel Belgrano'", direccion: "Ruta 2, Km 134,5", telefono: "Pública (Rural)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 11 'Esteban Echeverría'", direccion: "Paraje 'Villa del Sur'", telefono: "Pública (Rural)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 13", direccion: "Escuela rural de contexto plural", telefono: "Pública (Rural)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 14 'Don José Bilbao'", direccion: "Paraje 'El Espartillar'", telefono: "Pública (Rural)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 16", direccion: "Paraje 'El Recreo'", telefono: "Pública (Rural)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 19 'Nueve de Julio'", direccion: "Paraje '9 de Julio'", telefono: "Pública (Rural)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 21", direccion: "Paraje 'Gándara'", telefono: "Pública (Rural)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 25", direccion: "Pasaje Valle 'Santa Ana'", telefono: "Pública (Rural)" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "EP N° 27", direccion: "Escuela rural", telefono: "Pública (Rural)" },

    // EDUCACIÓN - PRIMARIAS PRIVADAS
    { tipo: "Educacion", subtipo: "Primaria", nombre: "Colegio e Instituto Corazón de María (ICM)", direccion: "Soler 14", telefono: "Privada" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "Colegio del Divino Corazón", direccion: "Alsina 33", telefono: "Privada" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "Escuela 'Nuestra Señora de Luján'", direccion: "Scalabrini Ortiz 137", telefono: "Privada" },
    { tipo: "Educacion", subtipo: "Primaria", nombre: "Escuela 'Las Luciérnagas'", direccion: "Alternativa pedagógica (Periurbana)", telefono: "Privada" },

    // EDUCACIÓN - SECUNDARIAS
    { tipo: "Educacion", subtipo: "Secundaria", nombre: "Escuela Técnica N° 1 (E.E.S.T N°1)", direccion: "Mackay y Casalins", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Secundaria", nombre: "Escuela Normal Superior (Secundaria)", direccion: "Av. Lastra y Av. Perón", telefono: "Pública (Provincial)" },
    { tipo: "Educacion", subtipo: "Secundaria", nombre: "Instituto Corazón de María (Secundaria)", direccion: "Soler 14", telefono: "Privada" },
    
    // EDUCACIÓN - TERCIARIA / ADULTOS
    { tipo: "Educacion", subtipo: "Terciaria/Adultos", nombre: "Escuela Primaria de Adultos N° 701", direccion: "Bahía Blanca 118", telefono: "Pública (Nocturna)" },
    { tipo: "Educacion", subtipo: "Terciaria/Adultos", nombre: "Conservatorio de Música", direccion: "Sarmiento y Lavalle", telefono: "Pública (Arte)" },
    { tipo: "Educacion", subtipo: "Terciaria/Adultos", nombre: "Instituto Superior de Formación Docente N° 98", direccion: "Av. Lastra y Av. Perón", telefono: "Pública (Terciaria)" },
    { tipo: "Educacion", subtipo: "Terciaria/Adultos", nombre: "INTECH (UNSAM - CONICET)", direccion: "Camino de Circunvalación", telefono: "Universidad / Investigación" },

    // EDUCACIÓN - ESPECIAL / ARTE
    { tipo: "Educacion", subtipo: "Especial", nombre: "Orquesta Escuela de Chascomús", direccion: "Fernando de Arenaza N° 150", telefono: "Pública (Arte/Municipal)" },
    { tipo: "Educacion", subtipo: "Especial", nombre: "Escuela de Educación Especial N° 504", direccion: "Rivadavia N° 25", telefono: "Pública (Especial)" }
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
