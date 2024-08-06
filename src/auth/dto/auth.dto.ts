import { Optional } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
	@IsEmail()
	email: string;

	@MinLength(6, { message: 'password must be at least 6 characters long' })
	@IsString()
	password: string;

	@IsString()
	@Optional()
	name: string;
}
