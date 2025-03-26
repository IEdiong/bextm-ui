import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ThemeService } from '@core/services/theme/theme.service';

@Component({
  selector: 'bem-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
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
