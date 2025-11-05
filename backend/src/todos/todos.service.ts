import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  // ---- Lấy tất cả Todo theo user, có search và phân trang ----
  async findAll(
    user: User,
    page = 1,
    limit = 5,
    search = '',
  ): Promise<Todo[]> {
    const skip = (page - 1) * limit;

    return this.todoRepository.find({
      where: {
        user,
        text: Like(`%${search}%`),
      },
      order: { id: 'DESC' },
      skip,
      take: limit,
    });
  }

  // ---- Lấy 1 Todo theo user ----
  async findOne(id: number, user: User): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id, user },
    });
    if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);
    return todo;
  }

  // ---- Tạo Todo mới ----
  async create(todoData: Partial<Todo>, user: User): Promise<Todo> {
    if (todoData.isCompleted === undefined) todoData.isCompleted = false;
    const todo = this.todoRepository.create({ ...todoData, user });
    return this.todoRepository.save(todo);
  }

  // ---- Cập nhật Todo ----
  async update(id: number, todoData: Partial<Todo>, user: User): Promise<Todo> {
    const todo = await this.findOne(id, user);
    Object.assign(todo, todoData);
    return this.todoRepository.save(todo);
  }

  // ---- Xóa Todo ----
  async remove(id: number, user: User): Promise<void> {
    const result = await this.todoRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }
}
