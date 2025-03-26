import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ThemeService } from './core/services/theme/theme.service';

@Component({
  selector: 'bem-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  isDarkTheme = signal(this.themeService.theme);

  ngOnInit(): void {}

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkTheme.set(this.themeService.theme);
  }
}
