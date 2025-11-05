// todos/dto/todo.dto.ts
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MaxLength(200, { message: 'Text tối đa 200 ký tự' })
  text: string;
}

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  text?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
