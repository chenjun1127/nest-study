import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleType } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async onModuleInit() {
    await this.initializeRoles();
  }
  private async initializeRoles() {
    const roles = [
      { code: '0', label: '普通用户', type: RoleType.USER },
      { code: '1', label: '超级管理员', type: RoleType.SUPER_ADMIN },
      { code: '2', label: '管理员', type: RoleType.ADMIN },
      { code: '3', label: '其它角色', type: RoleType.OTHER },
    ];
    for (const role of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { code: role.code },
      });
      if (!existingRole) {
        await this.roleRepository.save(role);
      }
    }
  }
  // 创建角色
  async create(role: Partial<Role>): Promise<Role> {
    return this.roleRepository.save(role);
  }

  // 获取所有角色
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findByCode(code: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { code } });
  }

  async update(roleId: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ roleId });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }
}
