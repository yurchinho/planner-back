import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { TaskDto } from './dto/task.dto';
import { TaskService } from './task.service';

@Controller('user/tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Get()
	@Auth()
	async getAllTasks(@CurrentUser('id') userId: string) {
		return this.taskService.getAllTasks(userId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async createTask(@Body() dto: TaskDto, @CurrentUser('id') userId: string) {
		return this.taskService.createTask(dto, userId);
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@Put(':id')
	@HttpCode(200)
	async updateTask(
		@Body() dto: TaskDto,
		@CurrentUser('id') userId: string,
		@Param('id') id: string,
	) {
		return await this.taskService.updateTask(dto, userId, id);
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async deleteTask(@Param('id') id: string) {
		return this.taskService.deleteTask(id);
	}
}
