import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateViewModule } from './state-view/state-view.module';
import { EllipsisTextModule } from './ellipsis-text/ellipsis-text.module';


@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [StateViewModule,  EllipsisTextModule],
})
export class WidgetModule {}
