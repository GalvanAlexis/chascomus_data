import React, { useEffect, useState } from 'react';
import './index.css';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [demografia, setDemografia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('demografia')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setDemografia(data[0]);
        }
      } catch (error) {
        console.error("Error cargando datos:", error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="hero">
        <h1>Chascomús Data</h1>
        <p>Observatorio Abierto de Políticas Públicas. Información clara, transparente y accesible para todos los vecinos.</p>
      </header>

      <main>
        <section className="glass-panel animate-stagger sequence-1">
          <h2 className="panel-title">👥 Perfil Demográfico <span style={{fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)', marginLeft: '10px'}}>(En Vivo)</span></h2>
          
          <div className="bento-grid">
            <div className="widget">
              <div className="widget-icon">👥</div>
              <div className="widget-label">Población Total</div>
              <div className="widget-value">{loading ? "..." : (demografia?.poblacion || "Sin datos")}</div>
            </div>
            
            <div className="widget">
              <div className="widget-icon">📍</div>
              <div className="widget-label">Superficie Partido</div>
              <div className="widget-value">{loading ? "..." : (demografia?.superficie || "Sin datos")}</div>
            </div>

            <div className="widget">
              <div className="widget-icon">🏛️</div>
              <div className="widget-label">Intendente / Fundación</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{loading ? "..." : demografia?.intendente}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{loading ? "..." : demografia?.fundacion}</div>
            </div>
          </div>
        </section>

        <section className="glass-panel animate-stagger sequence-2">
          <h2 className="panel-title">📈 Siguientes Pasos (En desarrollo)</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            El motor de Web Scraping está extrayendo datos en vivo desde fuentes oficiales (INDEC, PBA).
            Próximamente esta sección mostrará gráficos interactivos de evolución poblacional, zonas comerciales y estado de la laguna.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
