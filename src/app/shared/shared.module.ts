import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { VideoComponent } from './components/video/video.component';


@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    VideoComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    VideoComponent
  ]
})
export class SharedModule { }
