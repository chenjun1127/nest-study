import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindAllUsersDto } from './dto/find-all-user.dto';
import { RoleService } from 'src/role/role.service';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private roleService: RoleService,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = createUserDto.password; // 在实际应用中，务必对密码进行加密
    user.content = createUserDto.content;
    user.isActive = true; // 默认激活用户

    // 获取“普通用户”角色
    const defaultRole = await this.roleService.findByCode('1');
    // // 分配默认角色
    user.roles = [defaultRole];
    console.log(defaultRole);

    // // 保存用户并返回
    const newUser = await this.userRepository.save(user);
    // // 分配默认角色并设置关联
    await this.roleService.update(defaultRole.roleId, defaultRole);
    return {
      code: 200,
      msg: 'success',
      data: newUser,
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

  async findUserWithRoles(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      return null; // 或者抛出异常
    }

    return user;
  }
}
