import { AuthOption } from "../config/auth-option.config";

interface AuthParams {
  username: string
  password: string
}

export interface RouteGuardOptions<T> {
  auth: AuthOption,
  params?: AuthParams,
  useFactory?: (...args: any[]) => T | Promise<T>;
}
