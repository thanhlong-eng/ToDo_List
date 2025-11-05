import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import { Todo } from './todos/entities/todo.entity';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    // 🔹 Load biến môi trường từ .env, global để mọi module dùng
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🔹 Cấu hình database qua ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '3306'), 10),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASS', ''),
        database: config.get<string>('DB_NAME', 'todo_app'),
        entities: [Todo, User],
        synchronize: true, // ⚠️ chỉ nên bật trong dev
      }),
    }),

    // 🔹 Các module khác
    TodosModule,
    AuthModule,
  ],
})
export class AppModule {}
