import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { ThemeService } from '@core/services/theme/theme.service';
import { IconLogoComponent } from '../icon-logo/icon-logo.component';

@Component({
  selector: 'bem-header',
  standalone: true,
  imports: [IconLogoComponent, NgOptimizedImage],
  template: `
    <header
      class="rounded-10 tablet:rounded-20 bg-neutral-0 shadow-header tablet:py-150 tablet:px-200 flex items-center justify-between border border-neutral-200 px-150 py-100 dark:border-none dark:bg-neutral-800 dark:shadow-none"
    >
      <bem-icon-logo />

      <button
        id="theme-toggle"
        title="Toggles light & dark"
        [ariaLabel]="
          isDarkTheme() === 'light' ? 'Toggle dark mode' : 'Toggle light mode'
        "
        aria-live="polite"
        class="rounded-12 focus-visible:ring-ring inline-flex size-[50px] items-center justify-center bg-neutral-100 transition-all duration-300 hover:bg-neutral-300 focus-visible:shadow-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-neutral-700 dark:hover:bg-neutral-600"
        (click)="toggleTheme()"
      >
        @if (isDarkTheme() === 'light') {
          <img
            ngSrc="icon-moon.svg"
            alt=""
            aria-hidden="true"
            width="22"
            height="22"
            priority
          />
        } @else {
          <img
            ngSrc="icon-sun.svg"
            alt=""
            aria-hidden="true"
            width="22"
            height="22"
            priority
          />
        }
      </button>
    </header>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  isDarkTheme = signal(this.themeService.theme);

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkTheme.set(this.themeService.theme);
  }
}
