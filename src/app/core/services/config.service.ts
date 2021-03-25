import * as localforage from 'localforage';
import { StorageService } from './storage.service';
import {  InjectionToken, PLATFORM_ID, Injectable, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';



import { RequestCacheService } from '../net/request-cache.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    private storageSrv: StorageService,
    private requestCacheSrv: RequestCacheService,
  ) {}

  async init() {
    // 项目初始化配置
    if (isPlatformBrowser(this.platformId)) {
       this.configLocalforage();
      console.log('config init run on brower')
    }
    if (isPlatformServer(this.platformId)) {
      console.log('config init run on server, on server时请求并不会经过express服务器,')
      // this.getCharaList();
    }
  }

  configLocalforage() {
    localforage.config({
      driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE,],
      name: 'NgPcr',
    });
  }

}
