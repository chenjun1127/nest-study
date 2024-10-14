import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('AuthGuard');
    const request = context.switchToHttp().getRequest<Request>();
    const role = this.reflector.get<string[]>('role', context.getHandler());
    if (role.includes(request.query.role as string)) {
      console.log('role', role);
      return true;
    }
    return false;
  }
}
