import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.enableCors({
    origin:['http://localhost:3001'],
    exposedHeaders: 'set-cookie',
    credentials: true
  })

  await app.listen(4200);
}
bootstrap();