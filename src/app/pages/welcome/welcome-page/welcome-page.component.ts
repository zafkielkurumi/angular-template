import { Component, InjectionToken, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';


@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  constructor(  @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('run on brower')
    }
    if (isPlatformServer(this.platformId)) {
      console.log('run on server, server时请求并不会经过express服务器,')
      // this.getCharaList();
    }
  }

}
