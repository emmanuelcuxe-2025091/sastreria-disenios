import {
  CategoryMeta,
  CompanyMilestone,
  CraftsmanshipPillar,
  EraMeta,
  Garment,
} from '../models/catalog.models';

export const CATALOG_CATEGORIES: readonly CategoryMeta[] = [
  {
    id: 'trajes-a-medida',
    label: 'Trajes a Medida',
    shortLabel: 'Trajes',
    description:
      'Sastrería masculina y contemporánea trazada desde cero con entretela flotante y caída natural.',
  },
  {
    id: 'gala-y-etiqueta',
    label: 'Gala y Etiqueta',
    shortLabel: 'Gala',
    description:
      'Esmoquin, ceremonias y alta costura nocturna confeccionada con lanas Barathea y sedas naturales.',
  },
  {
    id: 'sastreria-femenina',
    label: 'Sastrería Femenina',
    shortLabel: 'Femenina',
    description:
      'Siluetas arquitectónicas, blazers esculpidos y conjuntos que equilibran estructura y movimiento.',
  },
  {
    id: 'abrigos-y-capas',
    label: 'Abrigos y Capas',
    shortLabel: 'Abrigos',
    description:
      'Prendas de abrigo en cachemira pura y paños europeos de alto gramaje con acabados a mano.',
  },
  {
    id: 'camiseria-artesanal',
    label: 'Camisería Artesanal',
    shortLabel: 'Camisería',
    description:
      'Camisas de algodón egipcio doble cabo con cuellos sin fusionar y botones de nácar natural.',
  },
  {
    id: 'vestuario-corporativo',
    label: 'Vestuario Corporativo',
    shortLabel: 'Corporativo',
    description:
      'Programas integrales de sastrería ejecutiva diseñados para firmas e instituciones exigentes.',
  },
];

export const CATALOG_ERAS: readonly EraMeta[] = [
  { id: '2022-2026', label: '2022 – 2026', subtitle: 'Maestría Contemporánea' },
  { id: '2016-2021', label: '2016 – 2021', subtitle: 'Expansión de Alta Costura' },
  { id: '2006-2015', label: '2006 – 2015', subtitle: 'Consolidación Corporativa' },
  { id: '1998-2005', label: '1998 – 2005', subtitle: 'Archivo Fundacional' },
];

export const CRAFTSMANSHIP_PILLARS: readonly CraftsmanshipPillar[] = [
  {
    step: '01',
    title: 'Patronaje Individual desde Cero',
    description:
      'Cada prenda parte de un molde exclusivo dibujado con tiza sobre papel kraft a partir de más de 25 medidas anatómicas y estudio de postura.',
    metric: '25+ medidas',
  },
  {
    step: '02',
    title: 'Tejidos Nobles de Origen Certificado',
    description:
      'Seleccionamos lanas merino Super 150s, Barathea inglesa, cachemira mongola, lino irlandés y algodón egipcio Giza 45 de casas textileras históricas.',
    metric: 'Fibras 100% naturales',
  },
  {
    step: '03',
    title: 'Entretela Flotante y Costura Manual',
    description:
      'Construimos el pecho con crin de caballo cosida a mano (Full Canvas), logrando una solapa viva que se adapta al cuerpo con cada uso.',
    metric: 'Hasta 86 h de taller',
  },
  {
    step: '04',
    title: 'Pruebas de Afinación y Archivo Propio',
    description:
      'Entre dos y cuatro pruebas intermedias garantizan un aplomo irreprochable. Conservamos el patrón de cada cliente para futuras creaciones.',
    metric: 'Archivo permanente',
  },
];

export const CATALOG_GARMENTS: readonly Garment[] = [
  {
    id: 'garment-sd-2025-01',
    code: 'SD-2025-01',
    slug: 'traje-cruzado-azul-medianoche',
    name: 'Traje Cruzado Azul Medianoche',
    subtitle: 'Lana Super 150s con solapa de pico y caída estructural',
    category: 'trajes-a-medida',
    collection: 'Colección Maestría',
    year: 2025,
    era: '2022-2026',
    featured: true,
    summary:
      'Traje cruzado de seis botones con solapa de pico generosa y hombros equilibrados que proyectan presencia clásica con ligereza contemporánea.',
    story:
      'Confeccionado para celebrar casi tres décadas de patronaje propio en el taller. Cada costura interna fue asentada con plancha tradicional de vapor para dar a la solapa una rodadura limpia y duradera.',
    techniques: [
      'Entretela flotante Full Canvas',
      'Picado manual de solapa',
      'Ojales milaneses bordados en seda',
      'Botones funcionales en manga',
    ],
    specs: {
      fabric: 'Lana merino italiana Super 150s (280 g/m²)',
      lining: 'Bemberg Cupro azul petróleo transpirable',
      construction: 'Full Canvas de crin de caballo y lino',
      craftingHours: 64,
      fittings: 3,
      occasion: 'Dirección ejecutiva, ceremonias formales y actos diplomáticos',
    },
    images: [
      {
        url: 'images/catalog/traje-cruzado-azul.jpg',
        alt: 'Traje cruzado azul medianoche a medida con solapa de pico y botones de asta',
        caption: 'Vista principal en estudio — corte cruzado 6x2 con solapa de pico.',
        isPrimary: true,
      },
      {
        url: 'images/catalog/hero-atelier.jpg',
        alt: 'Mesa de corte artesanal en el taller Sastrería & Diseños',
        caption: 'Proceso de corte y modelado sobre maniquí en nuestro taller central.',
        isPrimary: false,
      },
    ],
  },
  {
    id: 'garment-sd-2024-04',
    code: 'SD-2024-04',
    slug: 'esmoquin-barathea-gala-imperial',
    name: 'Esmoquin Barathea Gala Imperial',
    subtitle: 'Solapa chal en seda grosgrain y corte entallado de rigor',
    category: 'gala-y-etiqueta',
    collection: 'Archivo Nocturno',
    year: 2024,
    era: '2022-2026',
    featured: true,
    summary:
      'Esmoquin negro de etiqueta rigurosa elaborado en lana Barathea inglesa con solapas chal revestidas en seda natural mate y botonadura forrada.',
    story:
      'Una de las siluetas emblemáticas de nuestra casa para bodas de noche y galas internacionales. El pantalón incorpora galón lateral en grosgrain y ajustadores laterales sin trabillas.',
    techniques: [
      'Revestimiento manual de solapa en seda grosgrain',
      'Botones forrados al tono',
      'Pantalón de etiqueta con galón lateral',
      'Cinturilla con hebillas ajustables ocultas',
    ],
    specs: {
      fabric: 'Lana Barathea inglesa 100% (320 g/m²)',
      lining: 'Seda jacquard negra tejida en telar',
      construction: 'Full Canvas artesanal con costuras invisibles',
      craftingHours: 72,
      fittings: 4,
      occasion: 'Galas de etiqueta negra, bodas nocturnas y premiaciones',
    },
    images: [
      {
        url: 'images/catalog/esmoquin-gala.jpg',
        alt: 'Esmoquin negro de etiqueta con solapa chal en seda grosgrain',
        caption: 'Esmoquin en Barathea negra con solapa chal continua en seda.',
        isPrimary: true,
      },
      {
        url: 'images/catalog/camiseria-artesanal.jpg',
        alt: 'Detalle de camisería blanca artesanal para acompañar etiqueta',
        caption: 'Acompañamiento sugerido con nuestra camisería de puño francés.',
        isPrimary: false,
      },
    ],
  },
  {
    id: 'garment-sd-2025-07',
    code: 'SD-2025-07',
    slug: 'conjunto-marfil-atelier-femenino',
    name: 'Conjunto Marfil Atelier',
    subtitle: 'Blazer arquitectónico de cintura esculpida y pantalón fluido',
    category: 'sastreria-femenina',
    collection: 'Silueta Contemporánea',
    year: 2025,
    era: '2022-2026',
    featured: true,
    summary:
      'Sastrería femenina de líneas depuradas en crepé de lana y seda color marfil, diseñado para combinar estructura escultórica y movimiento natural.',
    story:
      'Desarrollado con pinzas francesas continuas y una hombrera anatómica sumamente fina moldeada al vapor. Demuestra la versatilidad del taller en patronaje femenino de alta exigencia.',
    techniques: [
      'Pinzas francesas esculpidas al cuerpo',
      'Hombrera fina moldeada al vapor',
      'Bolsillos de vivo minimalistas',
      'Planchado de caída en pantalón palazzo',
    ],
    specs: {
      fabric: 'Crepé de lana virgen y seda natural marfil (260 g/m²)',
      lining: 'Seda habotai tono champán',
      construction: 'Entretela ligera flotante adaptada a silueta femenina',
      craftingHours: 54,
      fittings: 3,
      occasion: 'Eventos directivos, recepciones solemnes y protocolo diurno',
    },
    images: [
      {
        url: 'images/catalog/blazer-sastreria-femenina.jpg',
        alt: 'Blazer marfil de sastrería femenina con cintura esculpida y pantalón amplio',
        caption: 'Blazer arquitectónico marfil de línea entallada con pantalón amplio.',
        isPrimary: true,
      },
      {
        url: 'images/catalog/hero-atelier.jpg',
        alt: 'Taller de corte y confección a medida',
        caption: 'Patronaje y ajuste individual en el taller central.',
        isPrimary: false,
      },
    ],
  },
  {
    id: 'garment-sd-2023-02',
    code: 'SD-2023-02',
    slug: 'abrigo-cruzado-cachemira-camel',
    name: 'Abrigo Cruzado Cachemira Camel',
    subtitle: 'Paño de cachemira pura con solapas amplias y pespunte a mano',
    category: 'abrigos-y-capas',
    collection: 'Legado de Invierno',
    year: 2023,
    era: '2022-2026',
    featured: true,
    summary:
      'Abrigo largo cruzado en tono camel atemporal con solapas generosas, botones de asta natural veteada y pespunteado AMF perimetral a mano.',
    story:
      'Reinterpreta los grandes abrigos europeos que nuestra firma confeccionaba a finales de los noventa, aligerando el armado interior para vestirse cómodamente sobre traje completo.',
    techniques: [
      'Pespunte AMF artesanal en bordes y solapas',
      'Abertura trasera profunda con botón interior',
      'Bolsillos con solapa inclinada y forro cálido',
      'Remates interiores con bies de cupro',
    ],
    specs: {
      fabric: 'Cachemira pura mongola 100% (520 g/m²)',
      lining: 'Cupro satinado color tabaco',
      construction: 'Sastrería estructurada de abrigo de alto gramaje',
      craftingHours: 58,
      fittings: 3,
      occasion: 'Temporada invernal, viajes internacionales y protocolo exterior',
    },
    images: [
      {
        url: 'images/catalog/abrigo-camel.jpg',
        alt: 'Abrigo cruzado largo en cachemira color camel con pespunte a mano',
        caption: 'Abrigo largo en cachemira pura camel con botones efecto carey.',
        isPrimary: true,
      },
    ],
  },
  {
    id: 'garment-sd-2021-09',
    code: 'SD-2021-09',
    slug: 'traje-lino-mediterraneo-arena',
    name: 'Traje Tres Piezas Lino Arena',
    subtitle: 'Sastrería desestructurada en lino irlandés de alta caída',
    category: 'trajes-a-medida',
    collection: 'Sol y Oficio',
    year: 2021,
    era: '2016-2021',
    featured: true,
    summary:
      'Conjunto de tres piezas en lino color arena con hombro napolitano suave, chaleco de cinco botones y transpirabilidad superior.',
    story:
      'Diseñado para ceremonias diurnas y climas cálidos donde la formalidad no debe sacrificar confort. Su construcción ultraligera permite que la prenda acompañe cada movimiento sin rigidez.',
    techniques: [
      'Hombro napolitano suave sin hombrera',
      'Medio forro con costuras ribeteadas',
      'Chaleco entallado de espalda en lino',
      'Botones de cuerno natural pulido',
    ],
    specs: {
      fabric: 'Lino irlandés pesado de baja arruga (340 g/m²)',
      lining: 'Medio forro en batista de algodón y cupro',
      construction: 'Construcción desestructurada con pecho ligero',
      craftingHours: 48,
      fittings: 3,
      occasion: 'Bodas diurnas, recepciones en jardín y verano formal',
    },
    images: [
      {
        url: 'images/catalog/traje-lino-verano.jpg',
        alt: 'Traje tres piezas de lino color arena de corte desestructurado',
        caption: 'Tres piezas en lino irlandés arena con hombro natural.',
        isPrimary: true,
      },
    ],
  },
  {
    id: 'garment-sd-2020-03',
    code: 'SD-2020-03',
    slug: 'vestido-gala-terciopelo-borgona',
    name: 'Vestido de Gala Terciopelo Borgoña',
    subtitle: 'Corpiño arquitectónico de alta costura y falda drapeada',
    category: 'gala-y-etiqueta',
    collection: 'Alta Costura de Archivo',
    year: 2020,
    era: '2016-2021',
    featured: true,
    summary:
      'Vestido largo de noche en terciopelo de seda borgoña profundo con corsetería interna invisible y caída escultórica continua.',
    story:
      'Cada panel del terciopelo fue cortado respetando el sentido exacto del pelo para ofrecer un brillo uniforme y profundo bajo iluminación de salón. Una obra maestra de nuestra división de alta costura.',
    techniques: [
      'Corsetería interior cosida a mano',
      'Corte direccional en terciopelo de seda',
      'Drapeado diagonal sobre maniquí',
      'Dobladillo invisible asentado al vapor',
    ],
    specs: {
      fabric: 'Terciopelo de seda natural color borgoña profundo',
      lining: 'Crepé de seda al tono con estructura flexible',
      construction: 'Alta costura sobre maniquí con corsetería interna',
      craftingHours: 86,
      fittings: 4,
      occasion: 'Galas de honor, conciertos sinfónicos y recepciones nocturnas',
    },
    images: [
      {
        url: 'images/catalog/vestido-gala-terciopelo.jpg',
        alt: 'Vestido de noche largo en terciopelo de seda borgoña con cuerpo estructurado',
        caption: 'Terciopelo de seda borgoña moldeado sobre busto de alta costura.',
        isPrimary: true,
      },
    ],
  },
  {
    id: 'garment-sd-2019-11',
    code: 'SD-2019-11',
    slug: 'camisa-etiqueta-algodon-egipcio',
    name: 'Camisa Artesanal Algodón Egipcio',
    subtitle: 'Popelín doble cabo 140/2 con puño francés y nácar australiano',
    category: 'camiseria-artesanal',
    collection: 'Camisería de Precisión',
    year: 2019,
    era: '2016-2021',
    featured: false,
    summary:
      'Camisa blanca de vestir con cuello italiano semiabierto, costura francesa de alta densidad y botones tallados en nácar natural.',
    story:
      'Simboliza la disciplina silenciosa del taller: el pegado manual de manga con ligero embebido otorga una libertad de movimiento imposible de igualar en la confección industrial.',
    techniques: [
      'Costura inglesa de aguja sencilla (22 puntadas/pulgada)',
      'Pegado manual de manga con ligero fruncido',
      'Botones de nácar australiano con puntada zanco',
      'Refuerzos triangulares (mosquitas) en bajos laterales',
    ],
    specs: {
      fabric: 'Algodón egipcio Giza 45 doble cabo 140/2',
      lining: 'Entretela de algodón puro sin fusionar en cuello y puños',
      construction: 'Camisería artesanal de precisión a medida',
      craftingHours: 18,
      fittings: 2,
      occasion: 'Uso ejecutivo diario, etiqueta y acompañamiento de traje a medida',
    },
    images: [
      {
        url: 'images/catalog/camiseria-artesanal.jpg',
        alt: 'Camisa blanca de algodón egipcio con puño francés y botones de nácar',
        caption: 'Popelín Giza 45 doblado junto a muestras de camisería fina.',
        isPrimary: true,
      },
    ],
  },
  {
    id: 'garment-sd-2014-05',
    code: 'SD-2014-05',
    slug: 'linea-corporativa-banca-privada',
    name: 'Colección Ejecutiva Banca Privada',
    subtitle: 'Sastrería institucional coordinada para dirección y protocolo',
    category: 'vestuario-corporativo',
    collection: 'Identidad Institucional',
    year: 2014,
    era: '2006-2015',
    featured: false,
    summary:
      'Programa integral de vestuario ejecutivo a medida creado para equipos directivos, combinando lana tropical de alto rendimiento con sobriedad institucional.',
    story:
      'Un hito clave de nuestra etapa de consolidación empresarial: se trazaron más de 180 conjuntos con medidas individuales logrando cohesión impecable de marca para toda la organización.',
    techniques: [
      'Toma de medidas individual por colaborador',
      'Costuras reforzadas para jornadas intensivas',
      'Paleta cromática institucional coordinada',
      'Ajuste post-entrega garantizado',
    ],
    specs: {
      fabric: 'Lana fría tropical Super 120s con recuperación natural',
      lining: 'Sarga de viscosa transpirable de alta resistencia',
      construction: 'Half Canvas reforzado para durabilidad diaria',
      craftingHours: 36,
      fittings: 2,
      occasion: 'Representación corporativa, dirección general y atención ejecutiva',
    },
    images: [
      {
        url: 'images/catalog/vestuario-corporativo.jpg',
        alt: 'Conjunto ejecutivo corporativo a medida en lana fría gris antracita',
        caption: 'Sastrería ejecutiva diseñada para equipos de dirección y banca.',
        isPrimary: true,
      },
    ],
  },
  {
    id: 'garment-sd-2004-02',
    code: 'SD-2004-02',
    slug: 'traje-diplomatico-raya-diplomatica',
    name: 'Traje Histórico Raya Diplomática',
    subtitle: 'Pieza fundacional del archivo en franela gris carbón',
    category: 'trajes-a-medida',
    collection: 'Raíces del Taller',
    year: 2004,
    era: '1998-2005',
    featured: false,
    summary:
      'Traje clásico de raya diplomática en franela de lana peinada que definió el lenguaje sobrio y milimétrico de nuestra primera década.',
    story:
      'Conservado en nuestro archivo como referencia técnica de patronaje clásico: cada línea de tiza coincide con precisión exacta en hombros, costadillos y bolsillos de vivo.',
    techniques: [
      'Casado milimétrico de rayas en todas las uniones',
      'Solapa de muesca clásica con picado manual',
      'Pantalón de doble pinza con vuelta inglesa',
      'Forro cosido a mano en sisas',
    ],
    specs: {
      fabric: 'Franela inglesa de lana peinada gris carbón (360 g/m²)',
      lining: 'Sarga de rayón visón',
      construction: 'Full Canvas tradicional de primera generación',
      craftingHours: 68,
      fittings: 4,
      occasion: 'Archivo histórico, consejos directivos y sastrería invernal clásica',
    },
    images: [
      {
        url: 'images/catalog/traje-raya-diplomatica.jpg',
        alt: 'Traje clásico gris carbón con raya diplomática de archivo histórico',
        caption: 'Pieza de archivo (2004) en franela inglesa de raya diplomática.',
        isPrimary: true,
      },
    ],
  },
];

export const COMPANY_MILESTONES: readonly CompanyMilestone[] = [
  {
    id: 'milestone-1998',
    year: '1998',
    title: 'Fundación del Taller',
    subtitle: 'Los primeros trazos con tiza, regla de madera y tijera',
    description:
      'Nacimos como un taller familiar dedicado a la sastrería tradicional a medida, defendiendo el patronaje individual y el aplomo perfecto frente a la producción seriada.',
    highlightMetric: '1er taller artesanal',
    signatureGarmentSlug: 'traje-diplomatico-raya-diplomatica',
  },
  {
    id: 'milestone-2006',
    year: '2006',
    title: 'Alta Costura y Etiqueta Rigurosa',
    subtitle: 'Del traje diario a las grandes ceremonias',
    description:
      'Sumamos maestros cortadores especializados en esmoquin, trajes de gala y vestuario ceremonial utilizando lanas Barathea inglesas y sedas italianas certificadas.',
    highlightMetric: '+400 piezas de gala',
    signatureGarmentSlug: 'esmoquin-barathea-gala-imperial',
  },
  {
    id: 'milestone-2014',
    year: '2014',
    title: 'División de Vestuario Corporativo',
    subtitle: 'Sastrería a medida al servicio de organizaciones',
    description:
      'Llevamos la disciplina artesanal a empresas líderes con programas de imagen ejecutiva personalizados, confeccionando colecciones coherentes con tallaje individual.',
    highlightMetric: '18+ firmas atendidas',
    signatureGarmentSlug: 'linea-corporativa-banca-privada',
  },
  {
    id: 'milestone-2019',
    year: '2019',
    title: 'Sastrería Femenina y Camisería de Precisión',
    subtitle: 'Arquitectura textil para nuevas generaciones',
    description:
      'Consolidamos líneas dedicadas a blazers femeninos esculpidos, vestidos de gala estructurados y camisería fina en algodón egipcio Giza 45.',
    highlightMetric: '+1,400 prendas archivadas',
    signatureGarmentSlug: 'camisa-etiqueta-algodon-egipcio',
  },
  {
    id: 'milestone-2025',
    year: '2025 – Hoy',
    title: 'Archivo Curado de Trayectoria',
    subtitle: 'Casi tres décadas de oficio abiertas a futuros clientes',
    description:
      'Hoy documentamos nuestras piezas más representativas en este catálogo digital para que cada futuro cliente conozca la consistencia, los tejidos y la calidad real de nuestro trabajo.',
    highlightMetric: '28 años de trayectoria',
    signatureGarmentSlug: 'traje-cruzado-azul-medianoche',
  },
];
