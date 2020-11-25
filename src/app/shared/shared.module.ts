import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { VideoComponent } from './components/video/video.component';
import { RouteImagePipe } from './pipes/route-image.pipe';
import { DomSeguroPipe } from './pipes/dom-seguro.pipe';


@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    VideoComponent,
    RouteImagePipe,
    DomSeguroPipe
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    VideoComponent,
    RouteImagePipe
  ]
})
export class SharedModule { }
