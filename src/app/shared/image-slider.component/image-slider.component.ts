import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SlideInterface } from '../../core/interfaces/slide.interface';
import { Subject, Subscription, interval, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { LoggingService } from 'src/app/core/interfaces/services/logging.service';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private loggedInService: LoggingService
  ) {}

  loggedIn: any;

  @Input() slides!: string[];

  currentIndex: number = 0;
  sub$ = new Subject();

  getCurrentSlideUrl() {
    return `url('${this.slides[this.currentIndex]}')`;
  }

  goToSlide(slideIndex: number): void {
    this.currentIndex = slideIndex;
  }

  ngOnInit() {
    // Call goToSlide every 3 seconds
    const timer = interval(3000);
    timer.pipe(takeUntil(this.sub$)).subscribe(() => {
      this.goToNextSlide();
    });

    this.loggedInService.loggedIn$.subscribe((log) => (this.loggedIn = log));
  }
  goToNextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  ngOnDestroy(): void {
    this.sub$.next(null);
    this.sub$.complete();
  }

  toLogin() {
    this.router.navigate(['/login']);
  }

  toRegister() {
    this.router.navigate(['/register']);
  }
}
