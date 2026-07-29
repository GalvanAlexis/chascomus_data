import React, { useEffect, useState } from 'react';
import './index.css';
import { createClient } from '@supabase/supabase-js'
import { Home, Map, Users, MapPin, Globe, Landmark, Shield, Activity, GraduationCap } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [activeEstadoTab, setActiveEstadoTab] = useState('Ejecutivo');
  const [activeEducacionTab, setActiveEducacionTab] = useState('Primaria');
  const [demografia, setDemografia] = useState(null);
  
  // Lista unificada para el selector (Total + Barrios)
  const [listaZonas, setListaZonas] = useState([]);
  const [selectedZona, setSelectedZona] = useState(null);
  
  // Estado para las Autoridades
  const [autoridades, setAutoridades] = useState([]);
  
  // Estado para Establecimientos (Seguridad, Salud, etc)
  const [establecimientos, setEstablecimientos] = useState([]);
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

        // 4. Consolidar lista Zonas
        const zonaTotal = {
            id: 'global_total',
            isTotal: true,
            nombre: 'Chascomús (Total)',
            latitud: -35.5760,
            longitud: -58.0100,
            poblacion_estimada: demoGlobal?.poblacion || totalPob,
            piramide_demografica: piramideGlobal
        };

        const zonasFinal = [zonaTotal];
        if (barriosData) {
            zonasFinal.push(...barriosData);
        }

        setListaZonas(zonasFinal);
        setSelectedZona(zonaTotal);

        // 5. Fetch Autoridades
        const { data: authData } = await supabase
          .from('autoridades_estado')
          .select('*')
          .order('id', { ascending: true });
        
        if (authData) setAutoridades(authData);

        // 6. Fetch Establecimientos
        const { data: estabData } = await supabase
          .from('establecimientos')
          .select('*')
          .order('id', { ascending: true });
        
        if (estabData) setEstablecimientos(estabData);

      } catch (error) {
        console.error("Error cargando datos:", error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Filtrar autoridades según la solapa activa
  const autoridadesFiltradas = autoridades.filter(a => a.poder === activeEstadoTab);

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
            className={`nav-item ${activeTab === 'estado' ? 'active' : ''}`}
            onClick={() => setActiveTab('estado')}
          >
            <Landmark size={20} />
            <span>Transparencia Estado</span>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'seguridad' ? 'active' : ''}`}
            onClick={() => setActiveTab('seguridad')}
          >
            <Shield size={20} />
            <span>Seguridad Pública</span>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'salud' ? 'active' : ''}`}
            onClick={() => setActiveTab('salud')}
          >
            <Activity size={20} />
            <span>Salud Pública</span>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'educacion' ? 'active' : ''}`}
            onClick={() => setActiveTab('educacion')}
          >
            <GraduationCap size={20} />
            <span>Educación</span>
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
                  <div className="widget-icon">🏫</div>
                  <div className="widget-label">Establecimientos Educativos</div>
                  <div className="widget-value" style={{ color: '#60a5fa' }}>{loading ? "..." : (demografia?.escuelas_total || "0")}</div>
                </div>

                <div className="widget">
                  <div className="widget-icon">🏥</div>
                  <div className="widget-label">Centros de Salud Pública</div>
                  <div className="widget-value" style={{ color: '#f87171' }}>{loading ? "..." : (demografia?.hospitales_total || "0")}</div>
                </div>

                <div className="widget">
                  <div className="widget-icon">🚓</div>
                  <div className="widget-label">Dependencias de Seguridad</div>
                  <div className="widget-value" style={{ color: '#fbbf24' }}>{loading ? "..." : (demografia?.comisarias_total || "0")}</div>
                </div>

                <div className="widget" style={{ gridColumn: '1 / -1' }}>
                  <div className="widget-icon">⚖️</div>
                  <div className="widget-label">Autoridades y Poderes del Estado Local</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '15px' }}>
                    
                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid var(--accent)' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Poder Ejecutivo</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>{loading ? "..." : demografia?.intendente}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Intendente Municipal</div>
                    </div>
                    
                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid #10b981' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Poder Legislativo</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>Concejo Deliberante</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Órgano representativo de los vecinos</div>
                    </div>

                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid #f59e0b' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Poder Judicial (Local)</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>Juzgado de Paz / Faltas</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Justicia de proximidad</div>
                    </div>

                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PESTAÑA ESTADO (TRANSPARENCIA) */}
        {activeTab === 'estado' && (
          <div className="tab-pane">
            <header className="page-header">
              <h2 className="page-title">
                <Landmark size={32} color="var(--accent)" /> 
                Transparencia de Estado
              </h2>
              <p className="page-subtitle">Nómina oficial de funcionarios a cargo de los tres poderes de gobierno (Mandato 2023-2027).</p>
            </header>

            <section className="glass-panel" style={{ padding: '30px' }}>
              
              {/* Solapas (Tabs internas) */}
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
                {['Ejecutivo', 'Legislativo', 'Judicial', 'Consejo Escolar'].map(poder => (
                  <button 
                    key={poder}
                    onClick={() => setActiveEstadoTab(poder)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: activeEstadoTab === poder ? 'var(--accent)' : 'var(--text-muted)',
                      padding: '10px 30px',
                      fontSize: '1rem',
                      fontWeight: activeEstadoTab === poder ? 'bold' : 'normal',
                      borderBottom: activeEstadoTab === poder ? '3px solid var(--accent)' : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Poder {poder}
                  </button>
                ))}
              </div>

              {/* Lista de Autoridades */}
              {loading ? (
                <p>Cargando autoridades...</p>
              ) : (
                <div>
                  <div style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
                    Total funcionarios listados: {autoridadesFiltradas.length}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {autoridadesFiltradas.map(aut => (
                      <div key={aut.id} style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        padding: '20px',
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                          {aut.cargo}
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>
                          {aut.nombre}
                        </div>
                        {aut.bloque_partido && (
                          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#ccc' }}>
                            {aut.bloque_partido}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </section>
          </div>
        )}

        {/* PESTAÑA SEGURIDAD */}
        {activeTab === 'seguridad' && (
          <div className="tab-pane">
            <header className="page-header">
              <h2 className="page-title">
                <Shield size={32} color="var(--accent)" /> 
                Seguridad Pública
              </h2>
              <p className="page-subtitle">Mapa de dependencias policiales y de prevención comunal.</p>
            </header>

            <section className="glass-panel" style={{ padding: '30px' }}>
              {loading ? (
                <p>Cargando establecimientos...</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {establecimientos.filter(e => e.tipo === 'Seguridad').map(est => (
                    <div key={est.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderLeft: '4px solid #fbbf24',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                        {est.nombre}
                      </div>
                      
                      {est.direccion && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          <MapPin size={16} /> <span>{est.direccion}</span>
                        </div>
                      )}
                      
                      {est.telefono && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                          <span>📞 {est.telefono}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* PESTAÑA SALUD */}
        {activeTab === 'salud' && (
          <div className="tab-pane">
            <header className="page-header">
              <h2 className="page-title">
                <Activity size={32} color="var(--accent)" /> 
                Salud Pública
              </h2>
              <p className="page-subtitle">Mapa de establecimientos sanitarios, clínicas y centros de atención primaria.</p>
            </header>

            <section className="glass-panel" style={{ padding: '30px' }}>
              {loading ? (
                <p>Cargando establecimientos...</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {establecimientos.filter(e => e.tipo === 'Salud').map(est => (
                    <div key={est.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderLeft: '4px solid #f87171',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                        {est.nombre}
                      </div>
                      
                      {est.direccion && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          <MapPin size={16} /> <span>{est.direccion}</span>
                        </div>
                      )}
                      
                      {est.telefono && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                          <span>📞 {est.telefono}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* PESTAÑA EDUCACIÓN */}
        {activeTab === 'educacion' && (
          <div className="tab-pane">
            <header className="page-header">
              <h2 className="page-title">
                <GraduationCap size={32} color="var(--accent)" /> 
                Red Educativa
              </h2>
              <p className="page-subtitle">Principales jardines, escuelas primarias, secundarias y técnicas (Públicas y Privadas).</p>
            </header>

            <section className="glass-panel" style={{ padding: '30px' }}>
              {/* Solapas de Educación */}
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
                {['Primaria', 'Secundaria', 'Terciaria/Adultos', 'Especial'].map(nivel => (
                  <button 
                    key={nivel}
                    onClick={() => setActiveEducacionTab(nivel)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: activeEducacionTab === nivel ? 'var(--accent)' : 'var(--text-muted)',
                      padding: '10px 20px',
                      fontSize: '1rem',
                      fontWeight: activeEducacionTab === nivel ? 'bold' : 'normal',
                      borderBottom: activeEducacionTab === nivel ? '2px solid var(--accent)' : '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {nivel}
                  </button>
                ))}
              </div>

              {loading ? (
                <p>Cargando establecimientos...</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {establecimientos.filter(e => e.tipo === 'Educacion' && e.subtipo === activeEducacionTab).map(est => (
                    <div key={est.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderLeft: '4px solid #60a5fa', // Azul
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                        {est.nombre}
                      </div>
                      
                      {est.direccion && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          <MapPin size={16} /> <span>{est.direccion}</span>
                        </div>
                      )}
                      
                      {est.telefono && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                          <span>📚 {est.telefono}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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

        {/* Footer Global Dinámico: Fuentes de Datos */}
        <footer className="app-footer">
          <p style={{ fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>Observatorio de Datos Abiertos de Chascomús</p>
          <p style={{ fontSize: '0.8rem', marginBottom: '15px' }}>Última actualización del sistema: <strong>Julio 2026</strong></p>
          <div className="source-badges">
            
            {/* Fuentes para Demografía y Resumen */}
            {(activeTab === 'inicio' || activeTab === 'barrios') && (
              <>
                <span className="source-badge">Fuente: INDEC (Censo 2022)</span>
                <span className="source-badge">Fuente: Dir. Prov. de Estadística (DPE)</span>
                <span className="source-badge">Fuente: RENABAP</span>
              </>
            )}

            {/* Fuentes para Transparencia del Estado */}
            {activeTab === 'estado' && (
              <>
                <span className="source-badge">Fuente: Municipalidad de Chascomús</span>
                <span className="source-badge">Fuente: Honorable Concejo Deliberante (HCD)</span>
                <span className="source-badge">Fuente: Poder Judicial PBA</span>
              </>
            )}

          </div>
        </footer>

      </main>
    </div>
  );
}

export default App;
