import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { startOfDay, subDays } from 'date-fns';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id,
			},
			include: {
				tasks: true,
			},
		});
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email,
			},
		});
	}

	async getProfile(id: string) {
		const profile = await this.getById(id);
		console.log('profile', profile);
		const totalTasks = profile.tasks.length;

		const completedTasks = await this.prisma.task.count({
			where: {
				userId: id,
				isCompleted: true,
			},
		});

		const todayStart = startOfDay(new Date());
		console.log('todayStart', todayStart);
		const weekStart = startOfDay(subDays(new Date(), 7));
		console.log('weekStart', weekStart);

		const todayTasks = await this.prisma.task.count({
			where: {
				userId: id,
				created_at: {
					gte: todayStart.toISOString(),
				},
			},
		});
		console.log(todayTasks);

		const weekTasks = await this.prisma.task.count({
			where: {
				userId: id,
				created_at: {
					gte: weekStart.toISOString(),
				},
			},
		});
		console.log(weekTasks);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...rest } = profile;

		return {
			user: rest,
			statistics: [
				{ label: 'Total', value: totalTasks },
				{ label: 'Completed tasks', value: completedTasks },
				{ label: 'Today tasks', value: todayTasks },
				{ label: 'Week tasks', value: weekTasks },
			],
		};
	}
	async CreateUser(authDto: AuthDto) {
		const user = {
			email: authDto.email,
			name: authDto.name,
			password: await hash(authDto.password),
		};

		return this.prisma.user.create({
			data: user,
		});
	}

	async UpdateUser(id: string, userDto: UserDto) {
		let data = userDto;

		if (data.password) {
			data = { ...userDto, password: await hash(userDto.password) };
		}
		console.log(data);

		return this.prisma.user.update({
			where: {
				id,
			},
			data,
			select: {
				name: true,
				email: true,
				created_at: true,
				updated_at: true,
			},
		});
	}
}
