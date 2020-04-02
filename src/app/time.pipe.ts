import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = value - (minutes * 60);
    return `${minutes}:${seconds < 9 ? 0 : ''}${seconds}`;
  }

}
