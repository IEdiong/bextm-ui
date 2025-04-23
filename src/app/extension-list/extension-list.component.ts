import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ElementRef,
  viewChild,
  viewChildren,
} from '@angular/core';

import { CardComponent } from '../card/card.component';
import { ExtensionStore } from '../store/extensions.store';
import { Extension } from '../core/types';
import { ListAnimationDirective } from '@shared/directives';

@Component({
  selector: 'bem-extension-list',
  standalone: true,
  imports: [CardComponent, ListAnimationDirective],
  template: `
    @if (store.filteredExtensions().length > 0) {
      <ul
        class="extensions-container"
        bemListAnimation
        [animationConfig]="{
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          initialY: 30,
        }"
        #animationList="listAnimation"
      >
        @for (
          extension of store.filteredExtensions();
          track extension.name;
          let i = $index
        ) {
          <li #extensionItem>
            <bem-card
              [logo]="extension.logo"
              [name]="extension.name"
              [description]="extension.description"
              [isActive]="extension.isActive"
              [prioritize]="i < 9"
              (isActiveChange)="handleExtensionToggle(extension, $event)"
              (extensionRemoved)="handleExtensionRemoved(extension)"
            />
          </li>
        }
      </ul>
    } @else {
      <p class="text-center text-2xl text-white/80 italic">
        No extensions found
      </p>
    }
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
  extensionItems = viewChildren<ElementRef>('extensionItem');
  animationList = viewChild<ListAnimationDirective>('animationList');

  handleExtensionRemoved(extension: Extension): void {
    // Find the element for this extension
    const element = this.findExtensionElement(extension);

    if (element) {
      // Prepare for removal animation
      this.animationList()?.prepareForRemoval();

      // Remove the extension from the store
      this.store.removeExtension(extension);

      // After DOM update, animate items to their new positions
      setTimeout(() => {
        this.animationList()?.animatePositions();
      }, 0);
    } else {
      this.store.removeExtension(extension);
    }
  }

  handleExtensionToggle(extension: Extension, isActive: boolean): void {
    // Check if this toggle might cause the extension to be filtered out
    const currentFilter = this.store.activeFilter();
    const willBeFilteredOut =
      (currentFilter === 'active' && !isActive) ||
      (currentFilter === 'inactive' && isActive);

    if (willBeFilteredOut) {
      // Find the element for this extension
      const element = this.findExtensionElement(extension);

      if (element) {
        // Prepare for toggle animation
        this.animationList()?.prepareForRemoval();

        // Update the store to toggle the extension
        this.store.toggleExtensionActive(extension, isActive);

        // After DOM update, animate items to their new positions
        setTimeout(() => {
          this.animationList()?.animatePositions();
        }, 0);

        return; // Skip the default store update
      }
    }

    // If not being filtered out or element not found, just update the store
    this.store.toggleExtensionActive(extension, isActive);
  }

  /**
   * Finds the HTML element associated with a given extension.
   *
   * This method searches through the list of extension items to locate an element
   * that matches the specified extension. It looks for a `bem-card` element within
   * each item's native element and checks for a child element with a `data-extension-name`
   * attribute matching the extension's name.
   *
   * @param extension - The extension object containing the name to search for.
   * @returns The HTML element corresponding to the extension if found, or `null` if not found.
   */
  private findExtensionElement(extension: Extension): HTMLElement | null {
    const item = this.extensionItems().find((item) => {
      const cardElement = item.nativeElement.querySelector('bem-card');
      return (
        cardElement &&
        cardElement.querySelector(`[data-extension-name="${extension.name}"]`)
      );
    });

    return item?.nativeElement ?? null;
  }
}
