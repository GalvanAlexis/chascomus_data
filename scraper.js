const cheerio = require('cheerio');
const fs = require('fs');

async function generarHtmlDemografico() {
    console.log("1. Extrayendo datos demográficos de Wikipedia...");
    const url = "https://es.wikipedia.org/wiki/Chascom%C3%BAs";
    
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        let datosDemograficos = [];
        
        // 1. Extraer la tabla principal (Infobox)
        $('.infobox tr').each((index, element) => {
            const etiqueta = $(element).find('th').text().replace(/\n/g, ' ').trim();
            const valor = $(element).find('td').text().replace(/\n/g, ' ').trim();
            
            if (etiqueta && valor) {
                const valorLimpio = valor.replace(/\[\d+\]/g, ''); // Quitar referencias [1]
                datosDemograficos.push({ etiqueta, valor: valorLimpio });
            }
        });

        // 2. Extraer el texto de la sección Población (si existe)
        // Buscamos el subtítulo "Población" o "Demografía"
        let textoPoblacion = "";
        $('h2, h3').each((i, el) => {
            if ($(el).text().includes('Población') || $(el).text().includes('Demografía')) {
                // Obtenemos los párrafos siguientes
                let nextEl = $(el).parent().next(); // parent() porque los h2 están dentro de un div mw-heading en wikipedia moderna
                if(!nextEl.is('p')) {
                    nextEl = $(el).next('p'); // Fallback viejo formato
                }
                
                while (nextEl.length > 0 && !nextEl.is('h2') && !nextEl.is('h3')) {
                    if (nextEl.is('p')) {
                        textoPoblacion += `<p>${nextEl.text().replace(/\[\d+\]/g, '')}</p>`;
                    }
                    nextEl = nextEl.next();
                }
            }
        });

        console.log("2. Generando archivo HTML Premium...");
        
        // 3. Crear el diseño HTML (Premium, Glassmorphism, Moderno)
        const htmlOutput = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demografía - Chascomús</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0f172a;
            --card-bg: rgba(30, 41, 59, 0.7);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent: #38bdf8;
            --accent-glow: rgba(56, 189, 248, 0.5);
        }
        
        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-color);
            background-image: 
                radial-gradient(at 0% 0%, rgba(15, 23, 42, 1) 0, transparent 50%), 
                radial-gradient(at 50% 0%, rgba(56, 189, 248, 0.1) 0, transparent 50%), 
                radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.1) 0, transparent 50%);
            color: var(--text-main);
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
        }

        h1 {
            font-size: 3rem;
            font-weight: 800;
            text-align: center;
            margin-bottom: 10px;
            background: linear-gradient(to right, #38bdf8, #818cf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            text-align: center;
            color: var(--text-muted);
            margin-bottom: 40px;
            font-size: 1.1rem;
        }

        .glass-panel {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 30px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            margin-bottom: 30px;
        }

        h2 {
            font-size: 1.8rem;
            color: var(--accent);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 15px;
            margin-top: 0;
        }

        .data-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }

        .data-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            padding: 15px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .data-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            border-color: rgba(56, 189, 248, 0.3);
        }

        .data-label {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-muted);
            margin-bottom: 8px;
        }

        .data-value {
            font-size: 1.2rem;
            font-weight: 600;
        }
        
        .text-content {
            line-height: 1.8;
            color: #cbd5e1;
            font-size: 1.1rem;
        }

    </style>
</head>
<body>
    <div class="container">
        <h1>Demografía de Chascomús</h1>
        <div class="subtitle">Datos extraídos en tiempo real vía Web Scraping</div>

        <div class="glass-panel">
            <h2>Ficha Técnica y Población</h2>
            <div class="data-grid">
                ${datosDemograficos.map(d => `
                    <div class="data-card">
                        <div class="data-label">${d.etiqueta}</div>
                        <div class="data-value">${d.valor}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        ${textoPoblacion ? `
        <div class="glass-panel text-content">
            <h2>Análisis Histórico de Población</h2>
            ${textoPoblacion}
        </div>
        ` : ''}
    </div>
</body>
</html>
        `;

        fs.writeFileSync('demografia_chascomus.html', htmlOutput);
        console.log("3. ¡Éxito! Archivo 'demografia_chascomus.html' creado correctamente.");

    } catch (error) {
        console.error("Error:", error.message);
    }
}

generarHtmlDemografico();
