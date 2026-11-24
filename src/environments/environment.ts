import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  dataSource: 'local',
  postgrestBaseUrl: 'http://localhost:3000',
  company: {
    name: 'Sastrería & Diseños',
    tagline: 'Alta Confección y Sastrería de Trayectoria',
    foundedYear: 1998,
    email: 'atelier@sastreriadisenios.com',
    phoneDisplay: '+502 2345-6789',
    whatsappNumber: '50223456789',
    city: 'Ciudad de Guatemala · Taller Central',
    schedule: 'Lunes a Sábado · 09:00 a 18:00 (Cita previa)',
  },
};
