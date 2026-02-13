import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import hbs from 'hbs';
import { AppModule } from './app.module.js';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const session = require('express-session');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const passport = require('passport');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Setup view engine pakai Handlebars
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  // Set default layout
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('view options', { layout: 'layouts/main' });

  // Helper Handlebars untuk format harga
  hbs.registerHelper('formatPrice', (price: number) => {
    return 'Rp ' + Number(price).toLocaleString('id-ID');
  });

  // Helper untuk format tanggal
  hbs.registerHelper('formatDate', (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID');
  });

  // Helper untuk cek selected di dropdown
  hbs.registerHelper('eq', (a: any, b: any) => a == b);
  hbs.registerHelper('selected', (a: any, b: any) => (a == b ? 'selected' : ''));

  // Serve file statis (CSS, gambar, dll)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Setup session
  app.use(
    session({
      secret: 'admin-panel-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // Setup passport untuk autentikasi
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
  console.log('Server berjalan di http://localhost:3000');
}
bootstrap();
