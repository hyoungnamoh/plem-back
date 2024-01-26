import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import * as fcmServiceAccountKey from './fcmServiceAccountKey.json';
import * as admin from 'firebase-admin';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.use(passport.initialize());

  const fcmServiceAccount = {
    type: fcmServiceAccountKey.type,
    projectId: fcmServiceAccountKey.project_id,
    privateKeyId: fcmServiceAccountKey.private_key_id,
    privateKey: fcmServiceAccountKey.private_key,
    clientEmail: fcmServiceAccountKey.client_email,
    clientId: fcmServiceAccountKey.client_id,
    authUri: fcmServiceAccountKey.auth_uri,
    tokenUri: fcmServiceAccountKey.token_uri,
    authProviderX509CertUrl: fcmServiceAccountKey.auth_provider_x509_cert_url,
    clientC509CertUrl: fcmServiceAccountKey.client_x509_cert_url,
  };

  admin.initializeApp({
    credential: admin.credential.cert(fcmServiceAccount),
  });

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('Asia/Seoul');

  if (process.env.NODE_ENV === 'production') {
    // 수정 필요
    app.enableCors({ origin: ['https://'], credentials: true });
  } else {
    app.enableCors({ origin: '*', credentials: true });
  }

  app.useStaticAssets(path.join(__dirname, '..', 'notice-images'), {
    prefix: '/notice-images',
  });

  process.on('uncaughtException', (err) => {
    console.info(err);
    process.exit(1);
  });

  await app.listen(port);
  console.info(`listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
