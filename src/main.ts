import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const session = require('express-session');
import passport from 'passport';
import hbs from 'hbs';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // View engine setup (Handlebars)
  const viewsDir = join(__dirname, '..', 'views');
  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('hbs');

  // Configure default layout
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('view options', { layout: 'layouts/main' });

  hbs.registerPartials(join(viewsDir, 'partials'));

  // Register Handlebars helpers
  hbs.registerHelper('eq', (a: any, b: any) => a == b);
  hbs.registerHelper('formatPrice', (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  });
  hbs.registerHelper('formatDate', (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  });
  hbs.registerHelper('selected', (a: any, b: any) => {
    return a == b ? 'selected' : '';
  });

  // Static files
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Session middleware
  app.use(
    session({
      secret: 'nestjs-admin-panel-secret-key-2024',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // 1 hour
    }),
  );

  // Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
  console.log('🚀 Application running on http://localhost:3000');
}
bootstrap();
