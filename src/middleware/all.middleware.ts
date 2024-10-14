// 全局中间件
import { Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express'
const whiteList = ['/user','/auth/captcha'];

export const allMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // console.log('全局中间件')
  if (whiteList.includes(req.originalUrl)) {
    next()
  } else {
    res.send({
      code: 401,
      msg: '没有权限'
    })
  }
}