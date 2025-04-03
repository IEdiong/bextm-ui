import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { ExtensionStore } from '../store/extensions.store';
import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'bem-extension-list',
  standalone: true,
  imports: [CardComponent],
  template: `
    <ul
      class="extensions-container"
      [@listAnimation]="store.filteredExtensions().length"
    >
      @for (
        extension of store.filteredExtensions();
        track extension.name;
        let i = $index
      ) {
        <li [@itemAnimation]>
          <bem-card
            [logo]="extension.logo"
            [name]="extension.name"
            [description]="extension.description"
            [isActive]="extension.isActive"
            [prioritize]="i < 9"
            (isActiveChange)="store.toggleExtensionActive(extension, $event)"
            (extensionRemoved)="store.removeExtension(extension)"
          />
        </li>
      }
    </ul>
  `,
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        // query(
        //   ':enter',
        //   [
        //     style({ opacity: 0, scale: 0.5 }),
        //     stagger(50, [
        //       animate('300ms ease-out', style({ opacity: 1, scale: 1 })),
        //     ]),
        //   ],
        //   { optional: true },
        // ),
        query(
          ':leave',
          [animate('300ms ease-out', style({ opacity: 0, scale: 0.5 }))],
          { optional: true },
        ),
      ]),
    ]),
    trigger('itemAnimation', [
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0, scale: 0 })),
      ]),
    ]),
  ],
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
