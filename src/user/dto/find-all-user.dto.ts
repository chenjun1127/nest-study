import { IsOptional, IsString } from 'class-validator';

export class FindAllUsersDto {
  @IsOptional() // 标记为可选
  @IsString()
  keyword?: string; // 现在是可选属性

  @IsOptional() // 可选参数
  pageSize?: number;

  @IsOptional() // 可选参数
  pageNumber?: number;
}
