import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@celestial.com' },
    update: {},
    create: {
      name: 'The Archivist',
      email: 'admin@celestial.com',
      password: adminPassword,
      isAdmin: true,
    },
  })

  // Demo user
  const userPassword = await bcrypt.hash('user123', 10)
  await prisma.user.upsert({
    where: { email: 'seeker@celestial.com' },
    update: {},
    create: {
      name: 'Astrid Voyager',
      email: 'seeker@celestial.com',
      password: userPassword,
      isAdmin: false,
    },
  })

  // Availability slots
  const today = new Date()
  const dates = [0, 1, 2, 5, 7, 8].map((d) => {
    const date = new Date(today)
    date.setDate(today.getDate() + d)
    return date.toISOString().split('T')[0]
  })

  const times = [
    { startTime: '10:00', endTime: '10:30' },
    { startTime: '11:00', endTime: '11:30' },
    { startTime: '13:00', endTime: '14:00' },
    { startTime: '15:00', endTime: '16:00' },
    { startTime: '17:00', endTime: '18:00' },
  ]

  for (const date of dates) {
    for (const time of times) {
      await prisma.availability.upsert({
        where: {
          id: (await prisma.availability.findFirst({ where: { date, startTime: time.startTime } }))?.id ?? -1,
        },
        update: {},
        create: { date, ...time },
      })
    }
  }

  // ─────────────────────────────────────────────
  // CMS Content — English
  // ─────────────────────────────────────────────
  const contentEN = [
    // NAV
    { page: 'nav', key: 'home', value: 'Home' },
    { page: 'nav', key: 'how_it_works', value: 'How it works' },
    { page: 'nav', key: 'about', value: 'About me' },
    { page: 'nav', key: 'book', value: 'Book a session' },
    { page: 'nav', key: 'login', value: 'Login' },
    { page: 'nav', key: 'register', value: 'Register' },
    { page: 'nav', key: 'dashboard', value: 'Dashboard' },
    { page: 'nav', key: 'admin', value: 'Admin' },
    { page: 'nav', key: 'logout', value: 'Logout' },

    // FOOTER
    { page: 'footer', key: 'brand', value: 'wild.yet.sacred' },
    { page: 'footer', key: 'privacy', value: 'Privacy Policy' },
    { page: 'footer', key: 'terms', value: 'Terms of Service' },
    { page: 'footer', key: 'guidelines', value: 'Spirituality Guidelines' },
    { page: 'footer', key: 'copyright', value: '© 2026 WILD.YET.SACRED. ALL RIGHTS RESERVED.' },

    // HOME — text
    { page: 'home', key: 'hero_label', value: '✦ wild.yet.sacred ✦' },
    { page: 'home', key: 'hero_title', value: 'Mystical Guidance' },
    { page: 'home', key: 'hero_subtitle', value: '— Discover what the cards tell you' },
    { page: 'home', key: 'hero_body', value: 'Unveil the cosmic architecture of your life through bespoke tarot readings designed for the modern seeker.' },
    { page: 'home', key: 'cta_primary', value: 'Book a Session' },
    { page: 'home', key: 'cta_secondary', value: 'Learn More' },
    { page: 'home', key: 'usp1_title', value: 'Personal' },
    { page: 'home', key: 'usp1_body', value: 'Each session is uniquely tailored to your current energetic alignment and personal narrative.' },
    { page: 'home', key: 'usp2_title', value: 'Experienced' },
    { page: 'home', key: 'usp2_body', value: 'Over a decade of archival study in esoteric wisdom and traditional tarot symbology.' },
    { page: 'home', key: 'usp3_title', value: 'Online or In Person' },
    { page: 'home', key: 'usp3_body', value: 'Connect from anywhere in the world via digital sanctum or visit our physical archive.' },
    { page: 'home', key: 'process_title', value: 'Navigating your celestial path' },
    { page: 'home', key: 'step1_title', value: 'Book Your Space' },
    { page: 'home', key: 'step1_body', value: 'Select a duration that resonates with your inquiry. Our calendar is synchronized with celestial transitions.' },
    { page: 'home', key: 'step2_title', value: 'Connect in Presence' },
    { page: 'home', key: 'step2_body', value: 'We meet in a focused, meditative digital space to shuffle and lay the foundations of your spread.' },
    { page: 'home', key: 'step3_title', value: 'Receive Insight' },
    { page: 'home', key: 'step3_body', value: 'A detailed archival PDF of your reading, including card imagery and written interpretations for your records.' },
    { page: 'home', key: 'explore_title', value: 'What you can explore' },
    { page: 'home', key: 't1', value: '"The depth of the reading was unlike anything I\'ve experienced. A true archivist of the soul."' },
    { page: 'home', key: 't1_author', value: '— M.' },
    { page: 'home', key: 't2', value: '"Elegance and accuracy combined. The insights on my career were life-changing."' },
    { page: 'home', key: 't2_author', value: '— J.' },
    { page: 'home', key: 't3', value: '"Beautifully presented and profoundly resonant. I return for every major life transition."' },
    { page: 'home', key: 't3_author', value: '— A.' },
    { page: 'home', key: 'final_cta', value: 'Ready to consult the stars?' },
    { page: 'home', key: 'schedule_btn', value: 'Schedule Your Reading' },
    // HOME — images (empty until uploaded)
    { page: 'home', key: 'hero_image', value: '' },
    { page: 'home', key: 'process_image', value: '' },

    // HOW IT WORKS — text
    { page: 'howItWorks', key: 'label', value: 'The Sacred Methodology' },
    { page: 'howItWorks', key: 'title', value: 'The Alchemy of Archival Readings' },
    { page: 'howItWorks', key: 'subtitle', value: 'Beyond simple divination, our archival approach bridges the gap between ephemeral intuition and lasting wisdom.' },
    { page: 'howItWorks', key: 'step1_title', value: 'Preparation & Intention' },
    { page: 'howItWorks', key: 'step1_body', value: 'The ritual begins before we meet. You will receive a contemplative intake form designed to clarify your core inquiry. During this phase, we select a deck from our curated archival collection that resonates with your specific frequency.' },
    { page: 'howItWorks', key: 'step1_tag', value: 'Deck Selection & Intent Clearing' },
    { page: 'howItWorks', key: 'step2_title', value: 'The Living Connection' },
    { page: 'howItWorks', key: 'step2_body', value: 'Our sessions take place via high-definition video link, staged within our physical sanctuary. This is not a transactional reading; it is a live dialogue.' },
    { page: 'howItWorks', key: 'step2_tag', value: '60-Minute Real-Time Dialogue' },
    { page: 'howItWorks', key: 'step3_title', value: 'The Digital Archive' },
    { page: 'howItWorks', key: 'step3_body', value: 'Within 48 hours, you receive your Archival PDF. This bespoke document is a high-editorial report containing professional studio photography of your spread.' },
    { page: 'howItWorks', key: 'step3_tag', value: 'Bespoke 12-Page Editorial Report' },
    { page: 'howItWorks', key: 'archive_title', value: 'Inside the Archive' },
    { page: 'howItWorks', key: 'archive_subtitle', value: 'Preview the Artifacts of your journey' },
    { page: 'howItWorks', key: 'cta_title', value: 'Ready to transcribe your destiny?' },
    { page: 'howItWorks', key: 'cta_body', value: 'The Archive is open. Join us for a session that transcends time.' },
    { page: 'howItWorks', key: 'cta_btn', value: 'Begin your journey' },
    // HOW IT WORKS — images
    { page: 'howItWorks', key: 'step1_image', value: '' },
    { page: 'howItWorks', key: 'step2_image', value: '' },
    { page: 'howItWorks', key: 'step3_image', value: '' },

    // ABOUT — text
    { page: 'about', key: 'label', value: 'Introduction' },
    { page: 'about', key: 'title', value: 'The Keeper' },
    { page: 'about', key: 'title_accent', value: 'of the Cards' },
    { page: 'about', key: 'subtitle', value: 'A bridge between the celestial and the cerebral, curating narratives hidden within the arcana for the modern seeker.' },
    { page: 'about', key: 'biography_label', value: 'II. THE VOYAGE' },
    { page: 'about', key: 'biography_title', value: 'A Journey through the Stars' },
    { page: 'about', key: 'bio1', value: 'For over a decade, I have dedicated my life to the meticulous archival study of tarot symbology and esoteric philosophy. My journey didn\'t begin with a crystal ball, but in the dusty corners of forgotten libraries.' },
    { page: 'about', key: 'bio2', value: 'I approach the cards not as fortune-telling tools, but as a visual language of the collective unconscious. Through years of cross-referencing Jungian archetypes with medieval iconology, I\'ve developed a methodology that treats each reading as an editorial curation of a soul\'s current chapter.' },
    { page: 'about', key: 'mission_label', value: 'III. THE MISSION' },
    { page: 'about', key: 'mission_title', value: 'Bridging Ancient Mysticism with Contemporary Life' },
    { page: 'about', key: 'quote1', value: '"wild.yet.sacred was founded on a singular realization: our modern world is rich in data but poor in meaning."' },
    { page: 'about', key: 'quote2', value: 'I created this space to serve as a sanctuary where the rigorous precision of an archivist meets the intuitive depth of the mystic.' },
    { page: 'about', key: 'credentials_label', value: 'IV. METHODOLOGY' },
    { page: 'about', key: 'credentials_title', value: 'The Archival Standard' },
    { page: 'about', key: 'cred1_title', value: 'Meticulous Research' },
    { page: 'about', key: 'cred1_body', value: 'Every reading is grounded in cross-historical references, from the Visconti-Sforza to contemporary psychological frameworks.' },
    { page: 'about', key: 'cred2_title', value: 'Bespoke Reports' },
    { page: 'about', key: 'cred2_body', value: 'Receive a high-end, digital archival document detailing your session — a curated PDF \'editorial\', not a simple list.' },
    { page: 'about', key: 'cred3_title', value: 'Personal Narrative' },
    { page: 'about', key: 'cred3_body', value: 'The focus is always on your story. We use the cards to find the narrative threads that empower your next decisive movement.' },
    { page: 'about', key: 'cta_title', value: 'Ready to consult the archive?' },
    { page: 'about', key: 'cta_btn', value: 'Book a session with wild.yet.sacred' },
    { page: 'about', key: 'cta_note', value: 'Limited Monthly Consultations' },
    // ABOUT — images
    { page: 'about', key: 'hero_image', value: '' },
    { page: 'about', key: 'biography_image', value: '' },
    { page: 'about', key: 'philosophy_image', value: '' },

    // BOOK — text
    { page: 'book', key: 'hero_title', value: 'Secure Your Astral Guidance' },
    { page: 'book', key: 'hero_subtitle', value: 'Align your earthly intentions with the cosmic frequency. Enter the archive of your soul\'s blueprint and navigate the celestial tides.' },
    { page: 'book', key: 'step1_label', value: 'I' },
    { page: 'book', key: 'step1_title', value: 'Select Your Focus' },
    { page: 'book', key: 'step1_desc', value: 'Choose the ethereal path that calls to your current state of being.' },
    { page: 'book', key: 'focus1_title', value: 'Divine Love & Union' },
    { page: 'book', key: 'focus1_desc', value: 'Navigating the currents of romance, soulmate connections, and emotional harmony.' },
    { page: 'book', key: 'focus2_title', value: 'Abundance & Career' },
    { page: 'book', key: 'focus2_desc', value: 'Clarifying your earthly purpose and unlocking the flow of universal prosperity.' },
    { page: 'book', key: 'focus3_title', value: 'Personal Evolution' },
    { page: 'book', key: 'focus3_desc', value: 'Confronting the shadow self to facilitate radical transformation and growth.' },
    { page: 'book', key: 'focus4_title', value: 'Spiritual Alignment' },
    { page: 'book', key: 'focus4_desc', value: 'Finding internal equilibrium and tuning into higher-dimensional frequencies.' },
    { page: 'book', key: 'step2_label', value: 'II' },
    { page: 'book', key: 'step2_title', value: 'Temporal Alignment' },
    { page: 'book', key: 'duration_standard', value: 'Standard Ritual' },
    { page: 'book', key: 'duration_standard_time', value: '30 min' },
    { page: 'book', key: 'price_standard', value: '$85' },
    { page: 'book', key: 'duration_deep', value: 'Deep Communion' },
    { page: 'book', key: 'duration_deep_time', value: '60 min' },
    { page: 'book', key: 'price_deep', value: '$150' },
    { page: 'book', key: 'step3_label', value: 'III' },
    { page: 'book', key: 'step3_title', value: 'Celestial Timing' },
    { page: 'book', key: 'step4_label', value: 'IV' },
    { page: 'book', key: 'step4_title', value: 'Manifest Intent' },
    { page: 'book', key: 'field_name', value: 'Full Name' },
    { page: 'book', key: 'name_placeholder', value: 'Astrid Voyager' },
    { page: 'book', key: 'field_notes', value: 'What questions weigh heavy on your spirit today?' },
    { page: 'book', key: 'notes_placeholder', value: 'Speak into the silence...' },
    { page: 'book', key: 'submit_btn', value: 'Initiate the Ritual' },
    { page: 'book', key: 'success_title', value: 'Your ritual has been initiated.' },
    { page: 'book', key: 'success_body', value: 'We will confirm your session shortly. Check your dashboard for updates.' },
  ]

  // ─────────────────────────────────────────────
  // CMS Content — Spanish
  // ─────────────────────────────────────────────
  const contentES = [
    // NAV
    { page: 'nav', key: 'home', value: 'Inicio' },
    { page: 'nav', key: 'how_it_works', value: 'Cómo funciona' },
    { page: 'nav', key: 'about', value: 'Sobre mí' },
    { page: 'nav', key: 'book', value: 'Reservar sesión' },
    { page: 'nav', key: 'login', value: 'Entrar' },
    { page: 'nav', key: 'register', value: 'Registrarse' },
    { page: 'nav', key: 'dashboard', value: 'Mi Panel' },
    { page: 'nav', key: 'admin', value: 'Administrador' },
    { page: 'nav', key: 'logout', value: 'Cerrar sesión' },

    // FOOTER
    { page: 'footer', key: 'brand', value: 'wild.yet.sacred' },
    { page: 'footer', key: 'privacy', value: 'Política de Privacidad' },
    { page: 'footer', key: 'terms', value: 'Términos de Servicio' },
    { page: 'footer', key: 'guidelines', value: 'Directrices de Espiritualidad' },
    { page: 'footer', key: 'copyright', value: '© 2026 WILD.YET.SACRED. TODOS LOS DERECHOS RESERVADOS.' },

    // HOME — text
    { page: 'home', key: 'hero_label', value: '✦ wild.yet.sacred ✦' },
    { page: 'home', key: 'hero_title', value: 'Guía Mística' },
    { page: 'home', key: 'hero_subtitle', value: '— Descubre lo que las cartas te dicen' },
    { page: 'home', key: 'hero_body', value: 'Desvela la arquitectura cósmica de tu vida a través de lecturas de tarot únicas diseñadas para el buscador moderno.' },
    { page: 'home', key: 'cta_primary', value: 'Reserva una Sesión' },
    { page: 'home', key: 'cta_secondary', value: 'Saber Más' },
    { page: 'home', key: 'usp1_title', value: 'Personal' },
    { page: 'home', key: 'usp1_body', value: 'Cada sesión está diseñada para tu alineación energética actual y narrativa personal.' },
    { page: 'home', key: 'usp2_title', value: 'Experimentada' },
    { page: 'home', key: 'usp2_body', value: 'Más de una década de estudio archivístico en sabiduría esotérica y simbología del tarot tradicional.' },
    { page: 'home', key: 'usp3_title', value: 'Online o Presencial' },
    { page: 'home', key: 'usp3_body', value: 'Conéctate desde cualquier lugar del mundo o visita nuestro archivo físico.' },
    { page: 'home', key: 'process_title', value: 'Navegando tu camino celestial' },
    { page: 'home', key: 'step1_title', value: 'Reserva tu Espacio' },
    { page: 'home', key: 'step1_body', value: 'Selecciona una duración que resuene con tu consulta. Nuestro calendario está sincronizado con las transiciones celestiales.' },
    { page: 'home', key: 'step2_title', value: 'Conéctate en Presencia' },
    { page: 'home', key: 'step2_body', value: 'Nos reunimos en un espacio digital meditativo para barajar y establecer las bases de tu tirada.' },
    { page: 'home', key: 'step3_title', value: 'Recibe el Conocimiento' },
    { page: 'home', key: 'step3_body', value: 'Un detallado PDF archivístico de tu lectura, incluyendo imágenes de las cartas e interpretaciones escritas para tus registros.' },
    { page: 'home', key: 'explore_title', value: 'Lo que puedes explorar' },
    { page: 'home', key: 't1', value: '"La profundidad de la lectura fue incomparable. Una verdadera archivista del alma."' },
    { page: 'home', key: 't1_author', value: '— M.' },
    { page: 'home', key: 't2', value: '"Elegancia y precisión combinadas. Las perspectivas sobre mi carrera fueron transformadoras."' },
    { page: 'home', key: 't2_author', value: '— J.' },
    { page: 'home', key: 't3', value: '"Bellamente presentado y profundamente resonante. Regreso en cada gran transición de vida."' },
    { page: 'home', key: 't3_author', value: '— A.' },
    { page: 'home', key: 'final_cta', value: '¿Listo para consultar las estrellas?' },
    { page: 'home', key: 'schedule_btn', value: 'Programar tu Lectura' },
    // HOME — images (same as EN)
    { page: 'home', key: 'hero_image', value: '' },
    { page: 'home', key: 'process_image', value: '' },

    // HOW IT WORKS — text
    { page: 'howItWorks', key: 'label', value: 'La Metodología Sagrada' },
    { page: 'howItWorks', key: 'title', value: 'La Alquimia de las Lecturas Archivísticas' },
    { page: 'howItWorks', key: 'subtitle', value: 'Más allá de la simple adivinación, nuestro enfoque archivístico tiende un puente entre la intuición efímera y la sabiduría duradera.' },
    { page: 'howItWorks', key: 'step1_title', value: 'Preparación e Intención' },
    { page: 'howItWorks', key: 'step1_body', value: 'El ritual comienza antes de que nos reunamos. Recibirás un formulario contemplativo diseñado para aclarar tu consulta principal. Durante esta fase, seleccionamos una baraja de nuestra colección archivística curada que resuene con tu frecuencia específica.' },
    { page: 'howItWorks', key: 'step1_tag', value: 'Selección de Baraja y Limpieza de Intención' },
    { page: 'howItWorks', key: 'step2_title', value: 'La Conexión Viva' },
    { page: 'howItWorks', key: 'step2_body', value: 'Nuestras sesiones tienen lugar a través de enlace de video de alta definición, ambientadas dentro de nuestro santuario físico. No es una lectura transaccional; es un diálogo en vivo.' },
    { page: 'howItWorks', key: 'step2_tag', value: 'Diálogo en Tiempo Real de 60 Minutos' },
    { page: 'howItWorks', key: 'step3_title', value: 'El Archivo Digital' },
    { page: 'howItWorks', key: 'step3_body', value: 'En 48 horas, recibes tu PDF Archivístico. Este documento único es un informe editorial de alto nivel con fotografía profesional de estudio de tu tirada.' },
    { page: 'howItWorks', key: 'step3_tag', value: 'Informe Editorial de 12 Páginas a Medida' },
    { page: 'howItWorks', key: 'archive_title', value: 'Dentro del Archivo' },
    { page: 'howItWorks', key: 'archive_subtitle', value: 'Previsualiza los Artefactos de tu viaje' },
    { page: 'howItWorks', key: 'cta_title', value: '¿Listo para transcribir tu destino?' },
    { page: 'howItWorks', key: 'cta_body', value: 'El Archivo está abierto. Únete a nosotros para una sesión que trasciende el tiempo.' },
    { page: 'howItWorks', key: 'cta_btn', value: 'Comienza tu viaje' },
    // HOW IT WORKS — images
    { page: 'howItWorks', key: 'step1_image', value: '' },
    { page: 'howItWorks', key: 'step2_image', value: '' },
    { page: 'howItWorks', key: 'step3_image', value: '' },

    // ABOUT — text
    { page: 'about', key: 'label', value: 'Introducción' },
    { page: 'about', key: 'title', value: 'La Guardiana' },
    { page: 'about', key: 'title_accent', value: 'de las Cartas' },
    { page: 'about', key: 'subtitle', value: 'Un puente entre lo celestial y lo cerebral, curando narrativas ocultas en los arcanos para el buscador moderno.' },
    { page: 'about', key: 'biography_label', value: 'II. EL VIAJE' },
    { page: 'about', key: 'biography_title', value: 'Un Viaje a través de las Estrellas' },
    { page: 'about', key: 'bio1', value: 'Durante más de una década, he dedicado mi vida al meticuloso estudio archivístico de la simbología del tarot y la filosofía esotérica. Mi viaje no comenzó con una bola de cristal, sino en los polvorientos rincones de las bibliotecas olvidadas.' },
    { page: 'about', key: 'bio2', value: 'Me acerco a las cartas no como herramientas de adivinación, sino como un lenguaje visual del inconsciente colectivo. A través de años de referencias cruzadas de arquetipos jungianos con iconología medieval, he desarrollado una metodología que trata cada lectura como una curación editorial del capítulo actual del alma.' },
    { page: 'about', key: 'mission_label', value: 'III. LA MISIÓN' },
    { page: 'about', key: 'mission_title', value: 'Conectando el Misticismo Antiguo con la Vida Contemporánea' },
    { page: 'about', key: 'quote1', value: '"wild.yet.sacred fue fundada sobre una realización singular: nuestro mundo moderno es rico en datos pero pobre en significado."' },
    { page: 'about', key: 'quote2', value: 'Creé este espacio para servir como santuario donde la precisión rigurosa de un archivista se encuentra con la profundidad intuitiva del místico.' },
    { page: 'about', key: 'credentials_label', value: 'IV. METODOLOGÍA' },
    { page: 'about', key: 'credentials_title', value: 'El Estándar Archivístico' },
    { page: 'about', key: 'cred1_title', value: 'Investigación Meticulosa' },
    { page: 'about', key: 'cred1_body', value: 'Cada lectura está fundamentada en referencias históricas cruzadas, desde el Visconti-Sforza hasta los marcos psicológicos contemporáneos.' },
    { page: 'about', key: 'cred2_title', value: 'Informes a Medida' },
    { page: 'about', key: 'cred2_body', value: 'Recibe un documento archivístico digital de alta gama detallando tu sesión — un PDF \'editorial\' curado, no una simple lista.' },
    { page: 'about', key: 'cred3_title', value: 'Narrativa Personal' },
    { page: 'about', key: 'cred3_body', value: 'El enfoque siempre está en tu historia. Usamos las cartas para encontrar los hilos narrativos que empoderan tu próximo movimiento decisivo.' },
    { page: 'about', key: 'cta_title', value: '¿Listo para consultar el archivo?' },
    { page: 'about', key: 'cta_btn', value: 'Reservar sesión con wild.yet.sacred' },
    { page: 'about', key: 'cta_note', value: 'Consultas Mensuales Limitadas' },
    // ABOUT — images
    { page: 'about', key: 'hero_image', value: '' },
    { page: 'about', key: 'biography_image', value: '' },
    { page: 'about', key: 'philosophy_image', value: '' },

    // BOOK — text (ES)
    { page: 'book', key: 'hero_title', value: 'Asegura Tu Guía Astral' },
    { page: 'book', key: 'hero_subtitle', value: 'Alinea tus intenciones terrenales con la frecuencia cósmica. Entra en el archivo del plan de tu alma y navega las mareas celestiales.' },
    { page: 'book', key: 'step1_label', value: 'I' },
    { page: 'book', key: 'step1_title', value: 'Elige Tu Enfoque' },
    { page: 'book', key: 'step1_desc', value: 'Elige el camino etéreo que llama a tu estado actual de ser.' },
    { page: 'book', key: 'focus1_title', value: 'Amor Divino y Unión' },
    { page: 'book', key: 'focus1_desc', value: 'Navegando las corrientes del romance, las conexiones del alma y la armonía emocional.' },
    { page: 'book', key: 'focus2_title', value: 'Abundancia y Carrera' },
    { page: 'book', key: 'focus2_desc', value: 'Aclarando tu propósito terrenal y desbloqueando el flujo de la prosperidad universal.' },
    { page: 'book', key: 'focus3_title', value: 'Evolución Personal' },
    { page: 'book', key: 'focus3_desc', value: 'Confrontando el yo sombra para facilitar la transformación radical y el crecimiento.' },
    { page: 'book', key: 'focus4_title', value: 'Alineación Espiritual' },
    { page: 'book', key: 'focus4_desc', value: 'Encontrando el equilibrio interno y sintonizando con frecuencias de dimensiones superiores.' },
    { page: 'book', key: 'step2_label', value: 'II' },
    { page: 'book', key: 'step2_title', value: 'Alineación Temporal' },
    { page: 'book', key: 'duration_standard', value: 'Ritual Estándar' },
    { page: 'book', key: 'duration_standard_time', value: '30 min' },
    { page: 'book', key: 'price_standard', value: '$85' },
    { page: 'book', key: 'duration_deep', value: 'Comunión Profunda' },
    { page: 'book', key: 'duration_deep_time', value: '60 min' },
    { page: 'book', key: 'price_deep', value: '$150' },
    { page: 'book', key: 'step3_label', value: 'III' },
    { page: 'book', key: 'step3_title', value: 'Tiempo Celestial' },
    { page: 'book', key: 'step4_label', value: 'IV' },
    { page: 'book', key: 'step4_title', value: 'Manifiesta la Intención' },
    { page: 'book', key: 'field_name', value: 'Nombre Completo' },
    { page: 'book', key: 'name_placeholder', value: 'Astrid Voyager' },
    { page: 'book', key: 'field_notes', value: '¿Qué preguntas pesan en tu espíritu hoy?' },
    { page: 'book', key: 'notes_placeholder', value: 'Habla en el silencio...' },
    { page: 'book', key: 'submit_btn', value: 'Iniciar el Ritual' },
    { page: 'book', key: 'success_title', value: 'Tu ritual ha sido iniciado.' },
    { page: 'book', key: 'success_body', value: 'Confirmaremos tu sesión en breve. Consulta tu panel para actualizaciones.' },
  ]

  for (const item of contentEN) {
    await prisma.content.upsert({
      where: { page_key_locale: { page: item.page, key: item.key, locale: 'en' } },
      update: { value: item.value },
      create: { ...item, locale: 'en' },
    })
  }
  for (const item of contentES) {
    await prisma.content.upsert({
      where: { page_key_locale: { page: item.page, key: item.key, locale: 'es' } },
      update: { value: item.value },
      create: { ...item, locale: 'es' },
    })
  }

  console.log('✦ Seed complete')
  console.log('  Admin: admin@celestial.com / admin123')
  console.log('  User:  seeker@celestial.com / user123')
  console.log(`  Content: ${contentEN.length} EN items, ${contentES.length} ES items`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
