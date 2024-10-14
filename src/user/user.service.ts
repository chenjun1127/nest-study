import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindAllUsersDto } from './dto/find-all-user.dto';

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

  async findAll(query: FindAllUsersDto): Promise<any> {
    const pageSize = query.pageSize || 10; // 默认值为10
    const pageNumber = query.pageNumber || 1; // 默认值为1

    const sql: any = {
      where: {},
    };

    // 只有在 keyword 存在时才添加条件
    if (query.keyword) {
      sql.where.username = Like(`%${query.keyword}%`);
    }
    const total = await this.userRepository.count(sql);

    const data = await this.userRepository.find({
      ...sql,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
    return {
      total,
      data,
    };
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
