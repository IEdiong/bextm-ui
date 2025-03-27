import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FilterToolbarComponent } from './filter-toolbar/filter-toolbar.component';
import { ExtensionListComponent } from './extension-list/extension-list.component';

@Component({
  selector: 'bem-root',
  standalone: true,
  imports: [HeaderComponent, FilterToolbarComponent, ExtensionListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
