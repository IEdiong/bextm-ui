import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FilterToolbarComponent } from './filter-toolbar/filter-toolbar.component';

@Component({
  selector: 'bem-root',
  standalone: true,
  imports: [HeaderComponent, FilterToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  ngOnInit(): void {}
}
