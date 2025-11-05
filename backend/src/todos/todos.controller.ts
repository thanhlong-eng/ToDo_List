import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getAll(
    @Req() req,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '5',
  ): Promise<Todo[]> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 5;
    return this.todosService.findAll(req.user, pageNum, limitNum, search || '');
  }

  @Get(':id')
  getOne(@Param('id') id: number, @Req() req): Promise<Todo> {
    return this.todosService.findOne(+id, req.user);
  }

  @Post()
  create(@Body() dto: CreateTodoDto, @Req() req): Promise<Todo> {
    return this.todosService.create(dto, req.user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateTodoDto, @Req() req): Promise<Todo> {
    return this.todosService.update(+id, dto, req.user);
  }

  @Patch(':id')
  toggleComplete(@Param('id') id: number, @Body('isCompleted') isCompleted: boolean, @Req() req): Promise<Todo> {
    return this.todosService.update(+id, { isCompleted }, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req): Promise<void> {
    return this.todosService.remove(+id, req.user);
  }
}
