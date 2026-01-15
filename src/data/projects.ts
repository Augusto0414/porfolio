export interface Project {
  id: string;
  title: string;
  description: string;
  status: "Privado" | "Público";
  type: "carousel" | "video";
  github?: string;
  technologies: string[];
  images?: {
    alt: string;
    src: string;
  }[];
  videos?: {
    src: string;
    poster: string;
  }[];
}

export const projects: Project[] = [
  {
    id: "galapago",
    title: "Galápago App",
    description:
      "Aplicación móvil para consultores agrícolas con autenticación Firebase, notificaciones locales y lock screen.",
    status: "Privado",
    type: "carousel",
    technologies: ["React Native", "Firebase", "TypeScript"],
    images: [
      { src: "GALAPP/Captura de pantalla 2025-12-25 122027.png", alt: "Galápago App 1" },
      { src: "GALAPP/Captura de pantalla 2025-12-25 122103.png", alt: "Galápago App 2" },
      { src: "GALAPP/Captura de pantalla 2025-12-25 122205.png", alt: "Galápago App 3" },
      { src: "GALAPP/Captura de pantalla 2025-12-25 122319.png", alt: "Galápago App 4" },
    ],
  },
  {
    id: "viaja-conmigo",
    title: "Viaja Conmigo",
    description:
      "Aplicación móvil de viajes con React Native y panel administrativo con gestión de estado usando Zustand.",
    status: "Privado",
    type: "carousel",
    technologies: ["React Native", "React", "Tailwind", "Zustand"],
    images: [
      { src: "VIAJA_CONMIGO/01 00 00 00 00 1.png", alt: "Viaja Conmigo 1" },
      { src: "VIAJA_CONMIGO/01 00 00 00 00 3.png", alt: "Viaja Conmigo 2" },
      { src: "VIAJA_CONMIGO/Dashboard 01 00 00 00 00 5.png", alt: "Viaja Conmigo 3" },
      { src: "VIAJA_CONMIGO/Dashboard 01 00 00 00 00 6.png", alt: "Viaja Conmigo 4" },
    ],
  },
  {
    id: "mussico",
    title: "Mussico",
    description:
      "Plataforma para músicos y clientes con gestión de disponibilidad y perfiles desarrollada en Flutter y Firebase.",
    status: "Privado",
    type: "carousel",
    technologies: ["Flutter", "Dart", "Node.js", "MongoDB"],
    images: [
      { src: "MUSSICO/Iniciar sesión.jpg", alt: "Mussico 1" },
      { src: "MUSSICO/Registrarse.jpg", alt: "Mussico 2" },
      { src: "MUSSICO/Editar perfil artista.jpg", alt: "Mussico 3" },
      { src: "MUSSICO/Disponibilidad semana.jpg", alt: "Mussico 4" },
    ],
  },
  {
    id: "plantas",
    title: "Reconocimiento de Plantas IA",
    description:
      "App Flutter con visión computacional, modelo IA en Python y API REST en FastAPI desplegada con Docker.",
    status: "Privado",
    type: "carousel",
    technologies: ["Flutter", "Python", "FastAPI", "ML"],
    images: [
      { src: "Reconocimiento_plantas/WhatsApp Image 2025-12-25 at 12.46.13 PM.jpeg", alt: "Plantas IA 1" },
      { src: "Reconocimiento_plantas/WhatsApp Image 2025-12-25 at 12.46.3 PM.jpeg", alt: "Plantas IA 2" },
      { src: "Reconocimiento_plantas/WhatsApp Image 2025-12-25 at 12.46.13 PdM.jpeg", alt: "Plantas IA 3" },
      { src: "Reconocimiento_plantas/WhatsApp Image 2025-12-25 at 1ds2.46.12 PM.jpeg", alt: "Plantas IA 4" },
    ],
  },
  {
    id: "nu-clone",
    title: "Nu Clone",
    description:
      "Clon de la aplicación NuBank desarrollado como proyecto personal para practicar desarrollo móvil moderno y diseño de interfaces financieras.",
    status: "Público",
    type: "carousel",
    github: "https://github.com/Augusto0414/NuBank-Clone",
    technologies: ["React Native", "TypeScript", "Mobile"],
    images: [
      { src: "Nu/WhatsApp Image 2026-01-14 at 3.52.13 PM.jpeg", alt: "Nu Clone 1" },
      { src: "Nu/WhatsApp Image 2026-01-14 at 3.52.13 PMs.jpeg", alt: "Nu Clone 2" },
      { src: "Nu/WhatsApp Image 2026-01-14 at 3.52.13 PM.jpeg", alt: "Nu Clone 3" },
      { src: "Nu/WhatsApp Image 2026-01-14 at 3.52.13 PMs.jpeg", alt: "Nu Clone 4" },
    ],
  },
  {
    id: "callcenter",
    title: "Call Center Sistema",
    description:
      "Sistema completo de call center con gestión de llamadas, agentes y reportes en tiempo real desarrollado con tecnologías modernas.",
    status: "Privado",
    type: "carousel",
    technologies: ["React", "Micronaut", "Zustand", "WhatsApp API"],
    images: [
      { src: "CALLCENTER/Captura de pantalla 2025-12-25 134340.png", alt: "Call Center 1" },
      { src: "CALLCENTER/Captura de pantalla 2025-12-25 134504.png", alt: "Call Center 2" },
      { src: "CALLCENTER/Captura de pantalla 2025-12-25 134537.png", alt: "Call Center 3" },
      { src: "CALLCENTER/Captura de pantalla 2025-12-25 134610.png", alt: "Call Center 4" },
    ],
  },
  {
    id: "digiturno",
    title: "DigiTurno (Qflow)",
    description:
      "Sistema digital de gestión de turnos multitenant para hospitales con gestión de colas, notificaciones en tiempo real y panel administrativo.",
    status: "Privado",
    type: "video",
    technologies: ["React", "TypeScript", "Multitenant", "Real-time"],
    videos: [
      {
        src: "/assets/img/DigiTurno/digiturno-demo.mp4",
        poster: "DigiTurno/WhatsApp Image 2026-01-14 at 4.04.35 PM.jpeg",
      },
      {
        src: "/assets/img/DigiTurno/digiturno-demo-2.mp4",
        poster: "DigiTurno/WhatsApp Image 2026-01-14 at 4.04.35 PM.jpeg",
      },
    ],
  },
];
