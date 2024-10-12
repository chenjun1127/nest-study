import { Controller, Get, Req, Post, Res, Session, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import * as svgCaptcha from 'svg-captcha';
@Controller('auth')
export class AuthController {
  @Get('captcha')
  getCaptcha(@Req() req: Request, @Res() res: Response, @Session() session) {
    // 生成验证码
    const captcha = svgCaptcha.create({
      size: 4, // 验证码长度
      noise: 3, // 干扰线条的数量
      color: true, // 使用颜色
      background: '#cc9966', // 背景色
      height: 42,
    });
    session.captcha = captcha.text;
    // 将验证码图片以 SVG 格式返回给前端
    res.type('svg');
    res.send(captcha.data);
  }

  @Post('create')
  create(@Body() body, @Session() session) {
    console.log(body, session);
    if (
      session.captcha.toLocaleLowerCase() === body.captcha.toLocaleLowerCase()
    ) {
      return {
        code: 200,
        message: '验证码正确',
      };
    } else {
      return {
        code: 500,
        message: '验证码错误',
      }
    }
  }
}
