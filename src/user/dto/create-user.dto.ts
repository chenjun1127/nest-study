export class CreateUserDto {
  username: string;
  content: string;
  password: string;
  email: string;
  createTime: Date;
  isActive: boolean;
  updateTime: Date;
  roles: string[];
}
