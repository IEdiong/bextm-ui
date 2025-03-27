import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

type ITheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme: ITheme = 'light';
  private document = inject(DOCUMENT);

  constructor() {
    // Set theme based on user's preferences
    if (
      localStorage['theme'] === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.document.documentElement.setAttribute('data-theme', 'dark');
      this.theme = 'dark';
    } else {
      this.document.documentElement.setAttribute('data-theme', 'light');
      this.theme = 'light';
    }
  }

  toggleTheme(): void {
    // Toggle the theme
    const htmlElement = this.document.documentElement;

    if (this.theme === 'light') {
      this.theme = 'dark';
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage['theme'] = 'dark';
    } else {
      this.theme = 'light';
      htmlElement.setAttribute('data-theme', 'light');
      localStorage['theme'] = 'light';
    }
  }
}
