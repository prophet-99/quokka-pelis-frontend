import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'domSeguro'
})
export class DomSeguroPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer){}

  transform(url: string): any {
    // if (!url) return '';

    url = url.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')
      .replace('/view?usp=sharing', '/preview')
      .replace('https://youtu.be/', 'https://www.youtube.com/embed/');

    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);

  }
}
