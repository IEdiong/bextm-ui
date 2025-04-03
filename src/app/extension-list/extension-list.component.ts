import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
  effect,
  runInInjectionContext,
  Injector,
} from '@angular/core';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

import { CardComponent } from '../card/card.component';
import { ExtensionStore } from '../store/extensions.store';
import { Extension } from '../core/types';

// Register the plugin
gsap.registerPlugin(Flip);

@Component({
  selector: 'bem-extension-list',
  standalone: true,
  imports: [CardComponent],
  template: `
    <ul class="extensions-container">
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
            (isActiveChange)="store.toggleExtensionActive(extension, $event)"
            (extensionRemoved)="handleExtensionRemoved(extension, $event)"
          />
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block;
    }

    li {
      opacity: 0;
      transform: translateY(20px);
      will-change: transform, opacity;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtensionListComponent implements AfterViewInit, OnDestroy {
  readonly store = inject(ExtensionStore);
  private readonly injector = inject(Injector);
  @ViewChildren('extensionItem') extensionItems!: QueryList<ElementRef>;

  private timeline: gsap.core.Timeline | null = null;
  private observer: MutationObserver | null = null;

  ngAfterViewInit() {
    // Initial animation of items
    this.animateItemsIn();

    // Set up observer to detect DOM changes
    this.setupObserver();

    // Use runInInjectionContext to provide the injection context for effect
    runInInjectionContext(this.injector, () => {
      effect(() => {
        // Access the signal to track it
        this.store.filteredExtensions();
        // Give time for DOM to update before animating
        setTimeout(() => this.animateItemsIn(), 0);
      });
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.timeline) {
      this.timeline.kill();
    }
  }

  handleExtensionRemoved(extension: Extension, event: MouseEvent | unknown) {
    // Get the element that will be removed
    const element =
      (event as MouseEvent)?.target instanceof HTMLElement
        ? ((event as MouseEvent).target as HTMLElement)?.closest('li')
        : this.extensionItems.find((item) =>
            item.nativeElement.contains((event as MouseEvent)?.target),
          )?.nativeElement;

    if (element) {
      // Store positions of all items before removal
      const items = this.extensionItems
        .toArray()
        .map((ref) => ref.nativeElement);
      const positions = items.map((item) => {
        const rect = item.getBoundingClientRect();
        return { element: item, left: rect.left, top: rect.top };
      });

      // Remove the extension from the store
      this.store.removeExtension(extension);

      // After DOM update, animate items to their new positions
      setTimeout(() => {
        const currentItems = this.extensionItems
          .toArray()
          .map((ref) => ref.nativeElement);

        // For each current item, find its previous position
        currentItems.forEach((item, index) => {
          const prevPosition = positions.find((pos) => pos.element === item);
          if (prevPosition) {
            const rect = item.getBoundingClientRect();
            const deltaX = prevPosition.left - rect.left;
            const deltaY = prevPosition.top - rect.top;

            // Set initial position (where it was before)
            gsap.set(item, { x: deltaX, y: deltaY });

            // Animate to new position with stagger based on grid distance
            gsap.to(item, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              delay: index * 0.05,
            });
          }
        });
      }, 0);
    } else {
      this.store.removeExtension(extension);
    }
  }

  private animateItemsIn() {
    if (this.timeline) {
      this.timeline.kill();
    }

    const items = this.extensionItems.toArray().map((ref) => ref.nativeElement);

    this.timeline = gsap.timeline();

    // Reset items to initial state
    gsap.set(items, { opacity: 0, y: 20 });

    // Animate items in with stagger
    this.timeline.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
    });
  }

  private setupObserver() {
    // Create a MutationObserver to watch for changes to the list
    this.observer = new MutationObserver((mutations) => {
      // If nodes were added or removed, animate the current items
      if (
        mutations.some(
          (mutation) =>
            mutation.type === 'childList' &&
            (mutation.addedNodes.length > 0 ||
              mutation.removedNodes.length > 0),
        )
      ) {
        this.animateItemsIn();
      }
    });

    // Start observing the list container
    const container = this.extensionItems.first?.nativeElement.parentElement;
    if (container) {
      this.observer.observe(container, {
        childList: true,
        subtree: false,
      });
    }
  }
}
