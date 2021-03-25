import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Component, InjectionToken, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import * as localforage from 'localforage';
import { localforageName } from '@src/app/constants';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class RequestCacheService {
  // 要缓存的url
  urlList: string[] = [];
  // urlList = [pcrApis.getRank];
  private cache: { [key: string]: HttpResponse<any> } = {};

  constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<Object>) {}

  init() {
    return new Promise((resolve, reject) => {
      // 缓存的数据可能比较大使用indexdb
      // 如果临时缓存可使用sessionstorage

      if (isPlatformBrowser(this.platformId)) {
        console.log('cache init run on brower');
      }
      if (isPlatformServer(this.platformId)) {
        console.log('cache init run on server, on server时请求并不会经过express服务器,');
        // this.getCharaList();
      }
      resolve(true);
      // localforage.getItem<string>(localforageName.cacheHttp).then(r => {
      //   this.cache = r ? JSON.parse(r) : {};
      //   resolve(true);
      // });
    });

    // console.log('cache init');
  }

  clear() {
    this.cache = {};
    localforage.removeItem(localforageName.cacheHttp);
  }

  isCacheable(req: HttpRequest<any>): boolean {
    return this.urlList.includes(req.url);
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>) {
    this.cache[req.urlWithParams] = res;
    // localforage.setItem(localforageName.cacheHttp, JSON.stringify(this.cache));
  }

  get(req: HttpRequest<any>) {
    return this.cache[req.urlWithParams] ?? null;
  }
}
