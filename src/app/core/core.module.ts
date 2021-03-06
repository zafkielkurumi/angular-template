import { NgModule, ErrorHandler, APP_INITIALIZER, Optional, SkipSelf, ComponentFactoryResolver, Injector } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { CoreInterceptor } from "./net/core.interceptor";
import { CoreErrorHandler } from "./core-error-handler";
import { RouteReuseStrategy } from "@angular/router";
import { ConfigService } from "./services/config.service";
import { CacheReuseStrategy } from "./router-config/cacheReuseStrategy";
import { RequestCacheService } from "./net/request-cache.service";

const Configfactory = (config: ConfigService) => {
  return () => config.init();
};
const Cachefactory = (cache: RequestCacheService) => {
  return () => cache.init();
};

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CoreInterceptor, multi: true },
    { provide: ErrorHandler, useClass: CoreErrorHandler },
    { provide: APP_INITIALIZER, useFactory: Configfactory, multi: true, deps: [ConfigService] },
    { provide: APP_INITIALIZER, useFactory: Cachefactory, multi: true, deps: [RequestCacheService] },
    { provide: RouteReuseStrategy, useClass: CacheReuseStrategy },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
    }
  }
}
