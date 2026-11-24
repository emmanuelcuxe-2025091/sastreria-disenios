-- =============================================================================
-- Sastrería & Diseños — Initial Archive Seed Data (1998–2026)
-- =============================================================================

INSERT INTO core.categories (id, label, short_label, description, sort_order)
VALUES
  ('trajes-a-medida', 'Trajes a Medida', 'Trajes', 'Sastrería masculina y contemporánea trazada desde cero con entretela flotante.', 1),
  ('gala-y-etiqueta', 'Gala y Etiqueta', 'Gala', 'Esmoquin, frac y alta costura de noche para ceremonias memorables.', 2),
  ('sastreria-femenina', 'Sastrería Femenina', 'Femenina', 'Siluetas arquitectónicas, blazers estructurados y conjuntos de corte impecable.', 3),
  ('abrigos-y-capas', 'Abrigos y Capas', 'Abrigos', 'Prendas de abrigo en cachemira, lana virgen y paños europeos de alto gramaje.', 4),
  ('camiseria-artesanal', 'Camisería Artesanal', 'Camisería', 'Camisas en algodón egipcio con cuello moldeado a mano y botones de nácar.', 5),
  ('vestuario-corporativo', 'Vestuario Corporativo', 'Corporativo', 'Colecciones institucionales y ejecutivas de imagen sobria y alta durabilidad.', 6)
ON CONFLICT (id) DO NOTHING;

WITH inserted_garments AS (
  INSERT INTO core.garments (
    code, slug, name, subtitle, category_id, collection_name, year, era,
    is_featured, summary, story, fabric, lining, construction,
    crafting_hours, fittings, occasion
  )
  VALUES
    (
      'SD-2025-01',
      'traje-cruzado-azul-medianoche',
      'Traje Cruzado Azul Medianoche',
      'Lana Super 150s con solapa de pico y caída estructural',
      'trajes-a-medida',
      'Colección Maestría',
      2025,
      '2022-2026',
      TRUE,
      'Traje cruzado de seis botones con solapa de pico amplia y hombros ligeramente marcados que equilibran autoridad y ligereza.',
      'Confeccionado para conmemorar más de dos décadas de patronaje propio en el taller. Cada costura interior fue asentada a plancha de vapor tradicional para lograr una solapa con rodadura natural.',
      'Lana merino italiana Super 150s (280 g/m²)',
      'Bemberg Cupro azul petróleo transpirable',
      'Full Canvas (entretela flotante de crin de caballo)',
      64,
      3,
      'Dirección ejecutiva, ceremonias formales y actos diplomáticos'
    ),
    (
      'SD-2024-04',
      'esmoquin-barathea-gala-imperial',
      'Esmoquin Barathea Gala Imperial',
      'Solapa chal en seda grosgrain y corte entallado clásico',
      'gala-y-etiqueta',
      'Archivo Nocturno',
      2024,
      '2022-2026',
      TRUE,
      'Esmoquin negro de etiqueta rigurosa elaborado en lana Barathea inglesa con solapas chal revestidas en seda natural mate.',
      'Una de las piezas más solicitadas por clientes de gala internacional. El pantalón incorpora galón lateral de seda y cintura sin trabillas con ajustadores metálicos ocultos.',
      'Lana Barathea inglesa 100% (320 g/m²)',
      'Seda jacquard negra tejida en telar',
      'Full Canvas artesanal con ojales bordados en seda',
      72,
      4,
      'Galas de etiqueta negra, bodas nocturnas y premiaciones'
    ),
    (
      'SD-2025-07',
      'conjunto-marfil-atelier-femenino',
      'Conjunto Marfil Atelier',
      'Blazer arquitectónico de cintura esculpida y pantalón palazzo',
      'sastreria-femenina',
      'Silueta Contemporánea',
      2025,
      '2022-2026',
      TRUE,
      'Sastrería femenina de líneas depuradas en crepé de lana y seda color marfil, diseñado para proyectar presencia y fluidez.',
      'Desarrollado con pinzas francesas continuas y hombrera mínima moldeada al vapor, demostrando el dominio del taller en patronaje femenino de alta precisión.',
      'Mezcla de lana virgen y seda natural color marfil (260 g/m²)',
      'Seda habotai tono champán',
      'Entretela ligera flotante adaptada a silueta femenina',
      54,
      3,
      'Eventos corporativos de alto nivel, recepciones y protocolo diurno'
    ),
    (
      'SD-2023-02',
      'abrigo-cruzado-cachemira-camel',
      'Abrigo Cruzado Cachemira Camel',
      'Paño doble faz en cachemira pura con pespunte AMF a mano',
      'abrigos-y-capas',
      'Legado de Invierno',
      2023,
      '2022-2026',
      TRUE,
      'Abrigo largo cruzado en tono camel atemporal con solapas generosas, botones de asta natural y pespunteado perimetral artesanal.',
      'Inspirado en los grandes abrigos clásicos de finales de los noventa con un aligeramiento interno que permite llevarlo cómodamente sobre traje completo.',
      'Cachemira pura mongola 100% (520 g/m²)',
      'Cupro satinado tabaco',
      'Sastrería estructurada de abrigo con acabados a mano',
      58,
      3,
      'Temporada invernal, viajes ejecutivos y protocolo exterior'
    ),
    (
      'SD-2021-09',
      'traje-lino-mediterraneo-arena',
      'Traje Tres Piezas Lino Arena',
      'Sastrería desestructurada en lino irlandés de alta caída',
      'trajes-a-medida',
      'Sol y Oficio',
      2021,
      '2016-2021',
      FALSE,
      'Conjunto de tres piezas en lino color arena con hombro napolitano suave, chaleco de cinco botones y frescura excepcional.',
      'Creado para bodas de destino y recepciones en climas cálidos, combinando la elegancia formal del tres piezas con una construcción interior ultraligera.',
      'Lino irlandés pesado antiarrugas (340 g/m²)',
      'Medio forro en batista de algodón y cupro',
      'Construcción desestructurada con hombro camisa',
      48,
      3,
      'Ceremonias diurnas, eventos al aire libre y verano formal'
    ),
    (
      'SD-2020-03',
      'vestido-gala-terciopelo-borgona',
      'Vestido de Gala Terciopelo Borgoña',
      'Corpiño estructurado de alta costura y falda drapeada',
      'gala-y-etiqueta',
      'Alta Costura de Archivo',
      2020,
      '2016-2021',
      TRUE,
      'Vestido largo de noche en terciopelo de seda borgoña con corsetería interna invisible y caída escultórica.',
      'Cada panel del terciopelo fue cortado respetando la dirección exacta del pelo para lograr una profundidad cromática uniforme bajo luz de salón.',
      'Terciopelo de seda natural color borgoña profundo',
      'Crepé de seda al tono con ballenas flexibles',
      'Alta costura con corsetería interna cosida a mano',
      86,
      4,
      'Galas de honor, conciertos sinfónicos y recepciones nocturnas'
    ),
    (
      'SD-2019-11',
      'camisa-etiqueta-algodon-egipcio',
      'Camisa Artesanal Algodón Egipcio',
      'Popelín doble cabo 140/2 con puño francés y nácar australiano',
      'camiseria-artesanal',
      'Camisería de Precisión',
      2019,
      '2016-2021',
      FALSE,
      'Camisa blanca de vestir con cuello italiano semiabierto, costura francesa de 22 puntadas por pulgada y botones de nácar natural.',
      'Representa la disciplina silenciosa del taller: mangas pegadas a mano con ligero fruncido para ofrecer libertad total de movimiento bajo el saco.',
      'Algodón egipcio Giza 45 doble cabo 140/2',
      'Entretela de algodón puro sin fusionar en cuello y puños',
      'Costura inglesa de aguja sencilla y pegado manual de manga',
      18,
      2,
      'Uso ejecutivo diario, etiqueta y acompañamiento de traje a medida'
    ),
    (
      'SD-2014-05',
      'linea-corporativa-banca-privada',
      'Colección Ejecutiva Banca Privada',
      'Sastrería institucional coordinada para dirección y atención',
      'vestuario-corporativo',
      'Identidad Institucional',
      2014,
      '2006-2015',
      FALSE,
      'Programa integral de vestuario a medida desarrollado para equipos directivos, combinando lana tropical resistente con identidad sobria.',
      'Un hito de nuestra etapa de consolidación empresarial: más de 180 conjuntos personalizados con medidas individuales manteniendo absoluta cohesión visual.',
      'Lana fría tropical Super 120s con tratamiento antiarrugas',
      'Poliviscosa transpirable de alta resistencia',
      'Half Canvas reforzado para uso intensivo diario',
      36,
      2,
      'Representación corporativa, dirección general y atención de alto nivel'
    ),
    (
      'SD-2004-02',
      'traje-diplomatico-raya-diplomatica',
      'Traje Histórico Raya Diplomática',
      'Pieza fundacional del archivo en franela gris carbón',
      'trajes-a-medida',
      'Raíces del Taller',
      2004,
      '1998-2005',
      FALSE,
      'Traje clásico de raya diplomática en franela de lana peinada que marcó el estilo sobrio y preciso de nuestra primera década.',
      'Conservado como referencia de patronaje histórico. Las rayas coinciden milimétricamente en hombros, costadillos y bolsillos de vivo.',
      'Franela inglesa de lana peinada gris carbón (360 g/m²)',
      'Sarga de rayón visón',
      'Full Canvas tradicional con picado manual de solapa',
      68,
      4,
      'Archivo histórico, directorio y sastrería clásica invernal'
    )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id, slug
)
INSERT INTO core.company_milestones (
  year_label, title, subtitle, description, highlight_metric, signature_garment_slug, sort_order
)
VALUES
  (
    '1998',
    'Fundación del Taller',
    'Los primeros trazos con tiza y tijera',
    'Nacimos como un taller familiar dedicado exclusivamente a la sastrería masculina tradicional, priorizando el patronaje individual y el ajuste perfecto sobre la producción en serie.',
    '1er taller artesanal',
    'traje-diplomatico-raya-diplomatica',
    1
  ),
  (
    '2006',
    'Incorporación de Alta Costura y Gala',
    'Del traje clásico a la etiqueta rigurosa',
    'Ampliamos nuestro equipo de maestros cortadores para incluir esmoquin, trajes de ceremonia y vestidos de gala estructurados con tejidos importados de Italia e Inglaterra.',
    '+400 piezas de gala',
    'esmoquin-barathea-gala-imperial',
    2
  ),
  (
    '2014',
    'División de Imagen Corporativa',
    'Sastrería a medida para empresas líderes',
    'Desarrollamos programas completos de vestuario institucional con toma de medidas personalizada, llevando el estándar de la sastrería artesanal al entorno corporativo.',
    '18+ firmas atendidas',
    'linea-corporativa-banca-privada',
    3
  ),
  (
    '2019',
    'Consolidación de Sastrería Femenina y Camisería',
    'Precisión arquitectónica en cada silueta',
    'Inauguramos líneas especializadas en blazers femeninos estructurados y camisería fina en algodón egipcio, ampliando el archivo del taller a nuevas generaciones de clientes.',
    '+1,400 prendas archivadas',
    'camisa-etiqueta-algodon-egipcio',
    4
  ),
  (
    '2025',
    'Archivo Digital y Proyección Contemporánea',
    'Oficio clásico con visión de futuro',
    'Hoy preservamos casi tres décadas de confección en este catálogo curado para que cada futuro cliente conozca la calidad real, los tejidos y los acabados que respaldan nuestra firma.',
    '28 años de trayectoria',
    'traje-cruzado-azul-medianoche',
    5
  )
ON CONFLICT DO NOTHING;
