import { ModuleMetadata } from "@nestjs/common";
import { RouteGuardOptions } from "../../support/definitions/route-guard.options";

export interface ISubscriptionModuleFeatureOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  hidden: boolean, // To exclude controller from Swagger
  options?: RouteGuardOptions<boolean>;
}

export interface ISubscriptionModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  hidden: boolean, // To exclude controller from Swagger
  useFactory: (
    ...args: any[]
  ) => Promise<RouteGuardOptions<boolean>> | RouteGuardOptions<boolean>;
}
