import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TaskDto } from './dto/task.dto';
@Injectable()
export class TaskService {
	constructor(private prisma: PrismaService) {}

	async getAllTasks(userId: string) {
		return this.prisma.task.findMany({
			where: { userId: userId },
		});
	}

	async createTask(taskDto: TaskDto, userId: string) {
		return this.prisma.task.create({
			data: {
				...taskDto,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});
	}

	async updateTask(taskDto: Partial<TaskDto>, userId: string, taskId: string) {
		console.log(taskDto, userId, taskId);
		return this.prisma.task.update({
			where: {
				userId: userId,
				id: taskId,
			},
			data: taskDto,
		});
	}

	async deleteTask(taskId: string) {
		return this.prisma.task.delete({
			where: {
				id: taskId,
			},
		});
	}
}
