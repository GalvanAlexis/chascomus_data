require('dotenv').config();
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function scraperWikipedia() {
    console.log("1. Conectando a Wikipedia (Chascomús)...");
    const url = "https://es.wikipedia.org/wiki/Chascom%C3%BAs";
    
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        console.log("2. Analizando datos demográficos...");
        
        let datos = {
            poblacion: "No encontrado",
            superficie: "No encontrado",
            intendente: "No encontrado",
            fundacion: "No encontrado"
        };
        
        // Extraemos la tabla lateral derecha (Infobox)
        $('.infobox tr').each((index, element) => {
            const etiqueta = $(element).find('th').text().trim().toLowerCase();
            const valor = $(element).find('td').text().replace(/\n/g, ' ').trim();
            
            if (etiqueta && valor) {
                const valorLimpio = valor.replace(/\[\d+\]/g, '').replace(/\u00a0/g, ' ');
                
                if (etiqueta.includes('total') && valorLimpio.includes('hab.')) {
                    datos.poblacion = valorLimpio.split('hab.')[0].trim() + ' hab.';
                } else if (etiqueta.includes('superficie')) {
                    datos.superficie = valorLimpio;
                } else if (etiqueta.includes('intendente')) {
                    datos.intendente = valorLimpio;
                } else if (etiqueta.includes('fundación')) {
                    datos.fundacion = valorLimpio;
                }
            }
        });

        console.log("3. Datos extraídos:", datos);
        console.log("4. Guardando en Supabase...");

        const { data, error } = await supabase
            .from('demografia')
            .insert([
                {
                    poblacion: datos.poblacion,
                    superficie: datos.superficie,
                    intendente: datos.intendente,
                    fundacion: datos.fundacion
                }
            ])
            .select();

        if (error) {
            console.error("❌ Error de Supabase:", error.message);
        } else {
            console.log("✅ Datos guardados exitosamente en la nube:", data);
        }

    } catch (error) {
        console.error("Error crítico:", error.message);
    }
}

scraperWikipedia();
