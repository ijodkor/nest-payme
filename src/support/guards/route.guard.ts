import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";

import { AUTH_GUARD_OPTIONS, AuthOption } from "../config/auth-option.config";
import { RouteGuardOptions } from "../definitions/route-guard.options";
import { BasicAuthGuard } from "./basic-auth.guard";

@Injectable()
export class RouteGuard implements CanActivate {
  constructor(
    @Inject(AUTH_GUARD_OPTIONS)
    private readonly options: RouteGuardOptions<boolean>,
    private readonly authGuard: BasicAuthGuard
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.options == null) {
      return true;
    }

    if (this.options.useFactory == null) {
      return true;
    }

    if (this.options.auth == AuthOption.BASIC_AUTH) {
      return this.authGuard.canActivate(context);
    }

    const request: Request = context.switchToHttp().getRequest<Request>();
    return this.options.useFactory(request)
  }
}
