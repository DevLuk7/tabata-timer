import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, interval, of } from 'rxjs';
import { map, switchMap, distinctUntilChanged, startWith, filter } from 'rxjs/operators';

const timeOfCycle = 240;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  numberOfCycle = 1;
  timeToEnd = this.numberOfCycle * timeOfCycle;
  time$: Observable<number>;
  timerSubject = new BehaviorSubject<'start' | 'stop' | 'reset'>('stop');
  running$: Observable<boolean>;

  constructor() {}

  ngOnInit() {
    this.timerSubject.asObservable().pipe(filter(x => x === 'reset')).subscribe(() => {
      this.timeToEnd = this.numberOfCycle * timeOfCycle;
    })

    this.time$ = this.timerSubject.asObservable().pipe(
      distinctUntilChanged((prev: string, curr: string) =>  curr === 'reset' ? false : prev === curr),
      switchMap(x =>
        x === 'start'
          ? interval(1000).pipe(
              startWith(null),
              map(() => {
                this.timeToEnd -= 1;
                return this.timeToEnd;
              })
            )
          : of(this.timeToEnd)
      )
    );

    this.running$ = this.timerSubject.asObservable().pipe(map(x => x === 'start'));
  }

  addCycle() {
    this.numberOfCycle += 1;
    this.timerSubject.next('reset');
  }

  removeCycle() {
    this.numberOfCycle -= 1;
    if (this.numberOfCycle < 1) {
      this.numberOfCycle = 1;
    }
    this.timerSubject.next('reset');
  }

  start() {
    this.timerSubject.next('start');
  }
  stop() {
    this.timerSubject.next('stop');
  }
  reset() {
    this.timerSubject.next('reset');
  }
}