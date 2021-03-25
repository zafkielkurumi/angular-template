import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponseBase,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { environment } from '@src/environments/environment';
import { CommonResult, ResultStatus } from '@src/app/models';
import { RequestCacheService } from './request-cache.service';
import { StorageService } from '../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable()
export class CoreInterceptor implements HttpInterceptor {
  constructor(private requestCacheSrv: RequestCacheService, private storageSrv: StorageService, private notificationSrc: NzNotificationService,) {}

  handleData(req: HttpRequest<any>, ev: HttpResponseBase, isCache: boolean): Observable<any> {
    if (ev.ok) {
      if (ev instanceof HttpResponse) {
        const body: CommonResult<any> = ev.body;
        if (body.code === ResultStatus.success) {
          if (isCache) {
            this.requestCacheSrv.put(req, new HttpResponse(Object.assign(ev, { body: body.data, url: ev.url! })));
          }

        } else {
          return throwError(new Error(body.msg));
        }
      }
    } 
    return throwError(new Error('statuscode not in range 200'));
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 处理请求头
    const req = request.clone({
      setHeaders: {
        token: 'customtoken',
      },
      url: environment.baseUrl + request.url,
    });
    // 处理需要缓存的请求
    const isCache = this.requestCacheSrv.isCacheable(request);
    const cachedResponse: HttpResponse<any> = this.requestCacheSrv.get(req);
    if (cachedResponse) {
      return of(new HttpResponse({
        body: cachedResponse.body,
        headers: cachedResponse.headers,
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        url: cachedResponse.url!
      }));
    } else {
      return next.handle(req).pipe(
        mergeMap((ev) => {
          if (ev instanceof HttpResponseBase) {
            return this.handleData(req, ev, isCache);
          }
          return of(ev);
        }),
        catchError((err) => {
          this.notificationSrc.error('', err.message);
          throw err;
        }),
      );
    }
  }
}
