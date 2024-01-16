import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';

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
