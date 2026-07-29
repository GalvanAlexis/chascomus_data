import React, { useEffect, useState } from 'react';
import './index.css';
import { createClient } from '@supabase/supabase-js'
import { Home, Map, Users, MapPin, Globe } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [demografia, setDemografia] = useState(null);
  
  // Lista unificada para el selector (Total + Barrios)
  const [listaZonas, setListaZonas] = useState([]);
  const [selectedZona, setSelectedZona] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Demografía General
        const { data: demoData } = await supabase
          .from('demografia')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        const demoGlobal = demoData && demoData.length > 0 ? demoData[0] : null;
        if (demoGlobal) setDemografia(demoGlobal);

        // 2. Fetch Pirámide Global (INDEC)
        const { data: indecData } = await supabase
          .from('indec_proyecciones')
          .select('*')
          .order('id', { ascending: true });

        let totalPob = 0;
        let piramideGlobal = [];
        if (indecData) {
          piramideGlobal = indecData.map(p => {
             totalPob += (p.poblacion_masculina + p.poblacion_femenina);
             return {
                 rango: p.rango_etario,
                 masc: p.poblacion_masculina,
                 fem: p.poblacion_femenina
             };
          });
        }

        // 3. Fetch Barrios
        const { data: barriosData } = await supabase
          .from('barrios_data')
          .select('*')
          .order('nombre', { ascending: true });

        // 4. Consolidar lista
        const zonaTotal = {
            id: 'global_total',
            isTotal: true,
            nombre: 'Chascomús (Total)',
            latitud: -35.5760, // Centro ciudad
            longitud: -58.0100,
            poblacion_estimada: demoGlobal?.poblacion || totalPob,
            piramide_demografica: piramideGlobal
        };

        const zonasFinal = [zonaTotal];
        if (barriosData) {
            zonasFinal.push(...barriosData);
        }

        setListaZonas(zonasFinal);
        setSelectedZona(zonaTotal); // Seleccionamos "Total" por defecto

      } catch (error) {
        console.error("Error cargando datos:", error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className="dashboard-layout">
      
      {/* Sidebar de Navegación */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>Chascomús</h1>
          <p>Observatorio de Datos</p>
        </div>
        
        <nav className="nav-menu">
          <div 
            className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`}
            onClick={() => setActiveTab('inicio')}
          >
            <Home size={20} />
            <span>Resumen General</span>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'barrios' ? 'active' : ''}`}
            onClick={() => setActiveTab('barrios')}
          >
            <Map size={20} />
            <span>Radiografía Demográfica</span>
          </div>
        </nav>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="main-content">
        
        {/* PESTAÑA INICIO */}
        {activeTab === 'inicio' && (
          <div className="tab-pane">
            <header className="page-header">
              <h2 className="page-title">
                <Users size={32} color="var(--accent)" /> 
                Perfil General <span className="live-badge">En Vivo</span>
              </h2>
              <p className="page-subtitle">Indicadores principales del Partido de Chascomús.</p>
            </header>

            <section className="glass-panel">
              <div className="bento-grid">
                <div className="widget">
                  <div className="widget-icon">👥</div>
                  <div className="widget-label">Población (Aprox)</div>
                  <div className="widget-value">{loading ? "..." : (demografia?.poblacion || "Sin datos")}</div>
                </div>
                
                <div className="widget">
                  <div className="widget-icon">📍</div>
                  <div className="widget-label">Superficie</div>
                  <div className="widget-value">{loading ? "..." : (demografia?.superficie || "Sin datos")}</div>
                </div>

                <div className="widget">
                  <div className="widget-icon">🏛️</div>
                  <div className="widget-label">Intendente / Fundación</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '10px' }}>{loading ? "..." : demografia?.intendente}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{loading ? "..." : demografia?.fundacion}</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PESTAÑA DEMOGRAFÍA / BARRIOS UNIFICADA */}
        {activeTab === 'barrios' && (
          <div className="tab-pane">
            <header className="page-header">
              <h2 className="page-title">
                <Map size={32} color="var(--accent)" /> 
                Radiografía Demográfica <span className="live-badge">En Vivo</span>
              </h2>
              <p className="page-subtitle">Explora la demografía total del partido o desglosada por zona.</p>
            </header>

            {loading ? (
              <p>Cargando radiografía...</p>
            ) : listaZonas.length === 0 ? (
              <p>No hay datos disponibles.</p>
            ) : (
              <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                
                {/* Selector de Zonas */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                  <section className="glass-panel" style={{ padding: '20px' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Catálogo Geográfico</h3>
                    <div className="barrios-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                      {listaZonas.map(z => (
                        <div 
                          key={z.id} 
                          onClick={() => setSelectedZona(z)}
                          style={{
                            padding: '15px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            background: selectedZona?.id === z.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                            border: `1px solid ${selectedZona?.id === z.id ? 'var(--accent)' : 'rgba(255,255,255,0.05)'}`,
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                        >
                          {z.isTotal ? (
                              <Globe size={20} color={selectedZona?.id === z.id ? 'var(--accent)' : 'var(--text-muted)'} />
                          ) : (
                              <MapPin size={18} color={selectedZona?.id === z.id ? 'var(--accent)' : 'var(--text-muted)'} />
                          )}
                          <span style={{ fontWeight: selectedZona?.id === z.id ? '600' : '400', color: selectedZona?.id === z.id ? '#fff' : 'var(--text-muted)' }}>
                            {z.nombre}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Detalle de la Zona y Pirámide */}
                <div style={{ flex: '2', minWidth: '400px' }}>
                  {selectedZona && (
                    <section className="glass-panel animate-stagger sequence-1" style={{ padding: '30px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                        <div>
                          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '5px' }}>{selectedZona.nombre}</h2>
                          {!selectedZona.isTotal && (
                            <div style={{ color: 'var(--text-muted)', display: 'flex', gap: '15px', fontSize: '0.9rem' }}>
                              <span>Lat: {selectedZona.latitud}</span>
                              <span>Lon: {selectedZona.longitud}</span>
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>Población Aprox.</div>
                          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                              {typeof selectedZona.poblacion_estimada === 'number' 
                                  ? selectedZona.poblacion_estimada.toLocaleString('es-AR')
                                  : selectedZona.poblacion_estimada}
                          </div>
                        </div>
                      </div>

                      {/* Pirámide del Barrio / Total */}
                      <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.1rem' }}>
                        Estructura Demográfica {selectedZona.isTotal ? 'General' : 'Interna'}
                      </h3>
                      
                      {selectedZona.piramide_demografica.length === 0 ? (
                        <p style={{color: 'var(--text-muted)'}}>Sin datos piramidales</p>
                      ) : (
                        <div className="pyramid-chart" style={{ padding: '15px', background: 'rgba(0,0,0,0.3)' }}>
                          <div className="pyramid-header" style={{ marginBottom: '15px' }}>
                            <div className="gender-label male">Varones</div>
                            <div className="age-label-header">Edad</div>
                            <div className="gender-label female">Mujeres</div>
                          </div>
                          
                          {selectedZona.piramide_demografica.slice().reverse().map((row, idx) => {
                            const maxBar = Math.max(...selectedZona.piramide_demografica.map(r => Math.max(r.masc, r.fem)));
                            const wMale = maxBar > 0 ? (row.masc / maxBar) * 100 : 0;
                            const wFemale = maxBar > 0 ? (row.fem / maxBar) * 100 : 0;

                            return (
                              <div key={idx} className="pyramid-row" style={{ marginBottom: '10px' }}>
                                <div className="bar-container left">
                                  <div className="bar male-bar" style={{ width: `${wMale}%` }}>
                                      <span className="bar-text">{row.masc.toLocaleString('es-AR')}</span>
                                  </div>
                                </div>
                                
                                <div className="age-label" style={{ fontSize: '0.8rem' }}>{row.rango}</div>
                                
                                <div className="bar-container right">
                                  <div className="bar female-bar" style={{ width: `${wFemale}%` }}>
                                      <span className="bar-text">{row.fem.toLocaleString('es-AR')}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                    </section>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* Footer Global: Fuentes de Datos */}
        <footer className="app-footer">
          <p>Observatorio de Datos Abiertos de Chascomús — Construido para la transparencia ciudadana.</p>
          <div className="source-badges">
            <span className="source-badge">Fuente: INDEC (Censo 2022)</span>
            <span className="source-badge">Fuente: Dir. Prov. de Estadística (DPE)</span>
            <span className="source-badge">Fuente: RENABAP</span>
          </div>
        </footer>

      </main>
    </div>
  );
}

export default App;
