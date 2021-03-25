import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { bootloader, hmrModule } from '@angularclass/hmr';

if (environment.production) {
  enableProdMode();
  window.console.log = function() {};
  window.console.info = function() {};
  window.console.warn = function() {};
}



export function hmrMain() {
  return (
    platformBrowserDynamic()
    .bootstrapModule(AppModule)
    // use `hmrModule` or the "@angularclass/hmr-loader"
    .then((ngModuleRef: any) => {
      // `module` global ref for webpackhmr
      // Don't run this in Prod
      return hmrModule(ngModuleRef, module);
    })
  );
}

if (environment.hmr) {
  bootloader(hmrMain);

} else {
  document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
  });
}

