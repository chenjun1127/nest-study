import { Body, Injectable, Session } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.createTime = createUserDto.updateTime = new Date();
    createUserDto.isActive = false;
    const createdUser = await this.userRepository.save(createUserDto);
    return {
      code: 200,
      msg: 'success',
      data: createdUser,
    };
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    var oldUser = await this.findOne(id);
    if (updateUserDto.username == oldUser.username) {
      return {
        code: 401,
        msg: '名称一样，禁止更新',
      };
    } else {
      await this.userRepository.update(id, updateUserDto);
      return {
        code: 200,
        msg: 'success',
      };
    }
  }

  async remove(id: string) {
    await this.userRepository.delete(id);
    return {
      code: 200,
      msg: '删除成功',
    };
  }
}
