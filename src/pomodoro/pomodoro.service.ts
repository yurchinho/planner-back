import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PomodoroRoundDto, PomodoroSessionDto } from './dto/pomodoro.dto';
@Injectable()
export class PomodoroService {
	constructor(private prisma: PrismaService) {}

	async getTodaySession(userId: string) {
		const today = new Date().toISOString().split('T')[0];

		return await this.prisma.pomodoroSession.findFirst({
			where: {
				created_at: {
					gte: new Date(today),
				},
				userId,
			},
			include: {
				pomodoroRounds: {
					orderBy: {
						id: 'asc',
					},
				},
			},
		});
	}

	async create(userId: string) {
		const todaySession = await this.getTodaySession(userId);

		if (todaySession) return todaySession;

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				intervalsCount: true,
			},
		});

		if (!user) throw new NotFoundException('User not found');

		return await this.prisma.pomodoroSession.create({
			data: {
				pomodoroRounds: {
					createMany: {
						data: Array.from({ length: user.intervalsCount }, () => ({
							totalSeconds: 0,
						})),
					},
				},
				User: {
					connect: {
						id: userId,
					},
				},
			},
			include: {
				pomodoroRounds: true,
			},
		});
	}

	async update(
		dto: Partial<PomodoroSessionDto>,
		pomodoroId: string,
		userId: string,
	) {
		return this.prisma.pomodoroSession.update({
			where: {
				id: pomodoroId,
				userId,
			},
			data: dto,
		});
	}

	async updateRound(dto: Partial<PomodoroRoundDto>, roundId: string) {
		return this.prisma.pomodoroRound.update({
			where: {
				id: roundId,
			},
			data: dto,
		});
	}

	async deleteSession(sessionId: string, userId: string) {
		return await this.prisma.pomodoroSession.delete({
			where: {
				id: sessionId,
				userId: userId,
			},
		});
	}
}
