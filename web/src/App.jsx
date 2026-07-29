import React, { useEffect, useState } from 'react';
import './index.css';
import { createClient } from '@supabase/supabase-js'
import { Home, BarChart2, Map, Users, MapPin } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [demografia, setDemografia] = useState(null);
  const [piramide, setPiramide] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [selectedBarrio, setSelectedBarrio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: demoData } = await supabase
          .from('demografia')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (demoData && demoData.length > 0) {
          setDemografia(demoData[0]);
        }

        const { data: indecData } = await supabase
          .from('indec_proyecciones')
          .select('*')
          .order('id', { ascending: true }); 

        if (indecData) {
          setPiramide(indecData);
        }

        const { data: barriosData } = await supabase
          .from('barrios_data')
          .select('*')
          .order('nombre', { ascending: true });

        if (barriosData) {
          setBarrios(barriosData);
          if (barriosData.length > 0) {
            setSelectedBarrio(barriosData[0]);
          }
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
            <span>Resumen</span>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'demografia' ? 'active' : ''}`}
            onClick={() => setActiveTab('demografia')}
          >
            <BarChart2 size={20} />
            <span>Demografía</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'barrios' ? 'active' : ''}`}
            onClick={() => setActiveTab('barrios')}
          >
            <Map size={20} />
            <span>Barrios</span>
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

        {/* PESTAÑA DEMOGRAFÍA */}
        {activeTab === 'demografia' && (
          <div className="tab-pane">
            <header className="page-header">
              <h2 className="page-title">
                <BarChart2 size={32} color="var(--accent)" /> 
                Pirámide Poblacional <span className="live-badge">En Vivo</span>
              </h2>
              <p className="page-subtitle">Distribución etaria proyectada (INDEC / DPE).</p>
            </header>

            <section className="glass-panel">
              <div className="pyramid-container">
                {loading ? (
                  <p>Cargando datos del INDEC...</p>
                ) : piramide.length === 0 ? (
                  <p>No hay proyecciones disponibles.</p>
                ) : (
                  <div className="pyramid-chart">
                    <div className="pyramid-header">
                      <div className="gender-label male">Varones</div>
                      <div className="age-label-header">Edad</div>
                      <div className="gender-label female">Mujeres</div>
                    </div>
                    
                    {piramide.slice().reverse().map((row) => {
                      const maxBar = Math.max(...piramide.map(r => Math.max(r.poblacion_masculina, r.poblacion_femenina)));
                      const wMale = (row.poblacion_masculina / maxBar) * 100;
                      const wFemale = (row.poblacion_femenina / maxBar) * 100;

                      return (
                        <div key={row.id} className="pyramid-row">
                          <div className="bar-container left">
                            <div className="bar male-bar" style={{ width: `${wMale}%` }}>
                                <span className="bar-text">{row.poblacion_masculina.toLocaleString('es-AR')}</span>
                            </div>
                          </div>
                          
                          <div className="age-label">{row.rango_etario}</div>
                          
                          <div className="bar-container right">
                            <div className="bar female-bar" style={{ width: `${wFemale}%` }}>
                                <span className="bar-text">{row.poblacion_femenina.toLocaleString('es-AR')}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* PESTAÑA BARRIOS */}
        {activeTab === 'barrios' && (
          <div className="tab-pane">
            <header className="page-header">
              <h2 className="page-title">
                <Map size={32} color="var(--accent)" /> 
                Radiografía Barrial <span className="live-badge">En Vivo</span>
              </h2>
              <p className="page-subtitle">Explora los datos hiperlocales de cada barrio.</p>
            </header>

            {loading ? (
              <p>Cargando barrios...</p>
            ) : barrios.length === 0 ? (
              <p>No hay datos barriales disponibles.</p>
            ) : (
              <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                
                {/* Lista de Barrios */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                  <section className="glass-panel" style={{ padding: '20px' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Seleccionar Barrio</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {barrios.map(b => (
                        <div 
                          key={b.id} 
                          onClick={() => setSelectedBarrio(b)}
                          style={{
                            padding: '15px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            background: selectedBarrio?.id === b.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                            border: `1px solid ${selectedBarrio?.id === b.id ? 'var(--accent)' : 'rgba(255,255,255,0.05)'}`,
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                        >
                          <MapPin size={18} color={selectedBarrio?.id === b.id ? 'var(--accent)' : 'var(--text-muted)'} />
                          <span style={{ fontWeight: selectedBarrio?.id === b.id ? '600' : '400', color: selectedBarrio?.id === b.id ? '#fff' : 'var(--text-muted)' }}>
                            {b.nombre}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Detalle del Barrio */}
                <div style={{ flex: '2', minWidth: '400px' }}>
                  {selectedBarrio && (
                    <section className="glass-panel animate-stagger sequence-1" style={{ padding: '30px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                        <div>
                          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '5px' }}>{selectedBarrio.nombre}</h2>
                          <div style={{ color: 'var(--text-muted)', display: 'flex', gap: '15px', fontSize: '0.9rem' }}>
                            <span>Lat: {selectedBarrio.latitud}</span>
                            <span>Lon: {selectedBarrio.longitud}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>Población Aprox.</div>
                          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{selectedBarrio.poblacion_estimada.toLocaleString('es-AR')}</div>
                        </div>
                      </div>

                      {/* Pirámide del Barrio */}
                      <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.1rem' }}>Estructura Demográfica Interna</h3>
                      <div className="pyramid-chart" style={{ padding: '15px', background: 'rgba(0,0,0,0.3)' }}>
                        <div className="pyramid-header" style={{ marginBottom: '15px' }}>
                          <div className="gender-label male">Varones</div>
                          <div className="age-label-header">Edad</div>
                          <div className="gender-label female">Mujeres</div>
                        </div>
                        
                        {selectedBarrio.piramide_demografica.slice().reverse().map((row, idx) => {
                          const maxBar = Math.max(...selectedBarrio.piramide_demografica.map(r => Math.max(r.masc, r.fem)));
                          const wMale = (row.masc / maxBar) * 100;
                          const wFemale = (row.fem / maxBar) * 100;

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

                    </section>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
