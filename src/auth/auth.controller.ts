import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	debugger;
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(
		@Body() authDto: AuthDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { refreshToken, ...response } = await this.authService.login(authDto);
		this.authService.addRefreshTokenResponse(res, refreshToken);
		return response;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(
		@Body() authDto: AuthDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { refreshToken, ...response } =
			await this.authService.register(authDto);

		this.authService.addRefreshTokenResponse(res, refreshToken);

		return response;
	}

	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const refreshTokenFromCookies =
			req.cookies[this.authService.REFRESH_TOKEN_NAME];

		if (!refreshTokenFromCookies) {
			this.authService.RemoveRefreshTokenResponse(res);
			throw new UnauthorizedException('Refresh token not passed');
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookies,
		);

		this.authService.addRefreshTokenResponse(res, refreshToken);
		return response;
	}

	@HttpCode(200)
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.authService.RemoveRefreshTokenResponse(res);
		return true;
	}

	@HttpCode(200)
	@Post('update')
	async update() {}
}
