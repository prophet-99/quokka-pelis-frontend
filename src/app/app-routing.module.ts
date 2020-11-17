import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from './errors/page404/page404.component';


const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/pages.module').then( (m) => m.PagesModule )
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
