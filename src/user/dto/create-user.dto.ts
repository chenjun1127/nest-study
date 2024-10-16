import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional, IsArray, IsISO8601 } from 'class-validator';
import { Role } from 'src/role/entities/role.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional() // 使 content 字段可选
  @IsString() // 确保 content 是字符串
  content?: string;

  @IsOptional() // 使 createTime 字段可选
  @IsISO8601() // 确保是有效的 ISO 8601 日期格式
  createTime?: Date;

  @IsOptional() // 使 isActive 字段可选
  @IsBoolean() // 确保是布尔类型
  isActive?: boolean;

  @IsOptional() // 使 updateTime 字段可选
  @IsISO8601() // 确保是有效的 ISO 8601 日期格式
  updateTime?: Date;

  @IsOptional() // 使 roles 字段可选
  @IsArray() // 确保是数组
  roles?: Role[];
}
