# Proyecto de Extracción y Análisis de Datos: Vector Demográfico
**Municipalidad de Chascomús — Planificación de Políticas Públicas basadas en Evidencia**

## 1. Fundamentación y Objetivos
El presente documento establece el marco de trabajo para la primera fase del proyecto **Chascomús Data**, centrado en el **Vector Demográfico y Socioeconómico**. 
El objetivo es migrar de un modelo de toma de decisiones puramente reactivo a un modelo proactivo (Data-Driven Policy Making), utilizando técnicas de minería de datos (Web Scraping y consumo de APIs) para construir un mapa socio-habitacional actualizado de la ciudad.

## 2. Intenciones y Casos de Uso (Políticas Públicas)
Los datos que se extraerán en esta fase permitirán a la administración municipal:
1. **Planificación Urbana y Habitacional:** Identificar zonas con mayor densidad de población y compararlas con el mapa de servicios básicos (agua, cloacas) para priorizar obras de infraestructura.
2. **Asistencia Social de Precisión:** Cruzar datos de Necesidades Básicas Insatisfechas (NBI) para optimizar la distribución de recursos y programas de asistencia en los barrios más vulnerables.
3. **Desarrollo Económico:** Proveer a los inversores locales y empresas de datos poblacionales exactos para fomentar la instalación de nuevos comercios en áreas sub-abastecidas.
4. **Proyecciones Presupuestarias:** Anticipar el crecimiento poblacional por rango etario para proyectar necesidades de educación (nuevos jardines/escuelas) y salud pública (salas de primeros auxilios).

## 3. Fuentes de Datos Objetivo
En esta primera etapa, el sistema automatizado extraerá información de las siguientes fuentes públicas:
- **Instituto Nacional de Estadística y Censos (INDEC):** Extracción de tablas de microdatos del último censo nacional (Población, Vivienda, NBI).
- **Dirección Provincial de Estadística (DPE - PBA):** Extracción de proyecciones demográficas municipales actualizadas.
- **Ministerio de Economía (PBA):** Datos macroeconómicos y de empleo a nivel partido.
- **Wikipedia / Wikidata:** Extracción de metadatos estáticos e históricos para contexto.

## 4. Metodología de Extracción (Scraping)
1. **Peticiones HTTP y Parsing:** Se utilizarán scripts en Node.js (con librerías como `fetch` y `cheerio`) para descargar los documentos oficiales y reportes estadísticos.
2. **Transformación de Datos:** Los datos (frecuentemente tabulados en HTML o PDFs) serán limpiados y estructurados en formato `JSON` y `CSV`.
3. **Almacenamiento:** Los archivos limpios formarán el núcleo del repositorio Open Data de Chascomús, listos para ser consumidos por tableros de visualización (ej. PowerBI, Tableau o sistemas internos).

## 5. Fases del Proyecto (Vector 1)
- [ ] **Fase 1.1:** Aprobación del presente documento de intención.
- [ ] **Fase 1.2:** Desarrollo de los scripts extractores para INDEC y DPE.
- [ ] **Fase 1.3:** Limpieza y estructuración de los datos extraídos (Generación de los JSON/CSV).
- [ ] **Fase 1.4:** Presentación del primer Dashboard Demográfico a las autoridades.
