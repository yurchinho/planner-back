import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TimeBlockDto } from './dto/time-block.dto';
@Injectable()
export class TimeBlockService {
	constructor(private prisma: PrismaService) {}

	async getAll(userId: string) {
		return this.prisma.timeBlocking.findMany({
			where: { userId: userId },
			orderBy: {
				order: 'asc',
			},
		});
	}

	async create(dto: TimeBlockDto, userId: string) {
		return this.prisma.timeBlocking.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});
	}

	async update(dto: TimeBlockDto, userId: string, timeBlockId: string) {
		return this.prisma.timeBlocking.update({
			where: {
				userId,
				id: timeBlockId,
			},
			data: dto,
		});
	}

	async delete(timeBlockId: string, userId: string) {
		return await this.prisma.timeBlocking.delete({
			where: {
				id: timeBlockId,
				userId,
			},
		});
	}

	async updateOrder(ids: string[]) {
		return await this.prisma.$transaction(
			ids.map((id, order) =>
				this.prisma.timeBlocking.update({
					where: {
						id,
					},
					data: { order },
				}),
			),
		);
	}
}
