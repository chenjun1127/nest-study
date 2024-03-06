Nest入门教程

## 安装
使用 Nest CLI 建立新项目非常简单。 在安装好 npm 后，您可以使用下面命令在您的 OS 终端中创建 Nest 项目：
```bash
npm i -g @nestjs/cli
nest new project-name
```
## 启动应用程序
```bash
npm run start
```
## CRUD生成器
在项目根目录下执行以下代码来生成资源,user是你要写的业务模块
```bash
nest g resource user
// 像这样传递`--no-spec`参数`nest g resource user --no-spec`来避免生成测试文件
nest g resource user --no-spec
```
生成时会让你选择生成资源的类型，我们选择REST API即可 这里生成一个处理器类而不是一个REST API控制器：
将会生成
```lua
src
 ├── users
 |  ├── dto
 |  |   ├── create-user.dto.ts
 |  |   └── update-user.dto.ts
 |  ├── entities
 |  |   └── user.entity.ts
 |  ├── users.controller.ts
 |  ├── users.module.ts
 |  └── users.service.ts
 ├── app.controller.spec.ts
 ├── app.controller.ts
 ├── app.module.ts
 ├── app.service.ts
 └── main.ts
```
生成的代码就是带有 Controller、Service、Module 的，并且也有了 CRUD 的样板代码。具体代码可以看user目录代码
## 引入 Typeorm 来做数据库的 CRUD。
```bash
npm install --save @nestjs/typeorm typeorm mysql2
```
在根模块引入用于数据库连接的 Module
```js
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: '*********',
    port: 3306,
    username: 'root',
    password: '******',
    database: '******',
    entities: [User],
    synchronize: true,
  }),UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
在刚创建的模块引入实体对应的 Module：
```js
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```
创建User实体，用 @Entity 标识。并且用 @Column、@PrimaryGeneratedColumn 来标识列和主键。
```js
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @Column()
  content: string;
}
```
上面字体中 id 字段的类型被设置为 'uuid'，这将使用 UUID 作为主键。TypeORM 会自动处理生成 UUID 并插入到数据库中。

如果你希望完全自定义生成方式，你可以使用 @BeforeInsert 装饰器和在实体类中添加一个方法来手动设置主键。
```js
import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  isActive: boolean;

  @Column()
  createTime: Date;

  @Column()
  updateTime: Date;

  @Column()
  content: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
```
service 里注入实体对应的操作类 Repository，就可以实现对 User 的增删改查了。
## 测试
项目运行起来后，使用 postman 进行测试