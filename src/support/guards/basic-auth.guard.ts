import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException, } from '@nestjs/common';
import { RouteGuardOptions } from "../definitions/route-guard.options";
import { AUTH_GUARD_OPTIONS } from "../config/auth-option.config";

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_GUARD_OPTIONS)
    private readonly config: RouteGuardOptions<boolean>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    // const response = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Unauthorized");
    }

    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        // throw new UnauthorizedException("Unauthorized");
        return false
      }

      const [username, password] = decoded.split(':');
      const isValidUser = this.config!.params!.username === username;
      const isValidPassword = this.config!.params!.password === password;

      if (!isValidUser || !isValidPassword) {
        return false;
      }
    } catch (error) {
      return false;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const header = (request.headers as any)['authorization'];
    if (!header) return undefined;

    const [type, token] = header.split(' ');
    return type === 'Basic' ? token : undefined;
  }

  private decodeToken(token: string) {
    try {
      return Buffer.from(token, 'base64').toString('utf8');
    } catch (error) {
      return undefined;
    }
  }
}
