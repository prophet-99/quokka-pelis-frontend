import { Pipe, PipeTransform } from '@angular/core';
import { environment } from './../../../environments/environment';

@Pipe({
  name: 'routeImage'
})
export class RouteImagePipe implements PipeTransform {

  transform(value: string): string {
    const parsedRoute = value.split('\\')[2];
    return `${ environment.baseResources }/posters/${ parsedRoute }`;
  }

}
