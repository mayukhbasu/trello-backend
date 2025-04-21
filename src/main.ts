import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

import * as dotenv from 'dotenv';
dotenv.config();


console.log('JWT_SECRET:', process.env.JWT_SECRET);

async function
 bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'secret123',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());


  await app.listen(3000);
}
bootstrap();
