import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: '1.92.96.166',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'test',
    entities: [User],
    synchronize: true,
  }),UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
