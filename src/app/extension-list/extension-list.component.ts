import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { ExtensionStore } from '../store/extensions.store';

@Component({
  selector: 'bem-extension-list',
  standalone: true,
  imports: [CardComponent],
  template: `
    <ul class="extensions-container">
      @for (extension of store.filteredExtensions(); track extension.name) {
        <li>
          <bem-card
            [logo]="extension.logo"
            [name]="extension.name"
            [description]="extension.description"
            [isActive]="extension.isActive"
            (isActiveChange)="store.toggleExtensionActive(extension, $event)"
          />
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtensionListComponent {
  readonly store = inject(ExtensionStore);
}
