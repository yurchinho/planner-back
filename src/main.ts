import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.use(cookieParser());
	app.enableCors({
		origin: 'http://localhost:3000',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		exposedHeaders: 'set-cookie',
		allowedHeaders: 'Content-Type, Authorization',
		credentials: true,
	});

	await app.listen(4200);
}
bootstrap();
