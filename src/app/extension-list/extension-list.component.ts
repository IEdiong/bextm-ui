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

import { CardComponent } from '../card/card.component';
import { ExtensionStore } from '../store/extensions.store';
import { Extension } from '../core/types';

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
            (isActiveChange)="handleExtensionToggle(extension, $event)"
            (extensionRemoved)="handleExtensionRemoved(extension)"
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

  // Add a flag to track removal operations
  private isRemovalInProgress = false;

  // Add a flag to track toggle operations that might filter out items
  private isToggleFilterInProgress = false;

  ngAfterViewInit(): void {
    // Initial animation of items
    this.animateItemsIn();

    // Set up observer to detect DOM changes
    this.setupObserver();

    // Use runInInjectionContext to provide the injection context for effect
    runInInjectionContext(this.injector, () => {
      effect(() => {
        // Store previous count to determine if this is a filter change
        const prevCount = this.extensionItems?.length || 0;

        // Access the signal to track it - we need this to trigger the effect when it changes
        this.store.filteredExtensions();

        // Give time for DOM to update before animating
        setTimeout(() => {
          // If this is a filter change (not from removal), animate items in
          if (
            this.extensionItems?.length !== prevCount &&
            !this.isRemovalInProgress &&
            !this.isToggleFilterInProgress
          ) {
            this.animateItemsIn();
          }
        }, 0);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.timeline) {
      this.timeline.kill();
    }
  }

  handleExtensionRemoved(extension: Extension): void {
    // Set flag to prevent filter animation from triggering
    this.isRemovalInProgress = true;

    // Find the element for this extension using data attribute
    const element = this.extensionItems.find((item) => {
      const cardElement = item.nativeElement.querySelector('bem-card');
      return (
        cardElement &&
        cardElement.querySelector(
          '[data-extension-name="' + extension.name + '"]',
        )
      );
    })?.nativeElement;

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
              onComplete:
                index === currentItems.length - 1
                  ? () => {
                      // Reset the flag after animation completes
                      this.isRemovalInProgress = false;
                    }
                  : undefined,
            });
          }
        });

        // If no items to animate, reset the flag
        if (currentItems.length === 0) {
          this.isRemovalInProgress = false;
        }
      }, 0);
    } else {
      this.store.removeExtension(extension);
      // Reset the flag since we're not doing custom animation
      this.isRemovalInProgress = false;
    }
  }

  handleExtensionToggle(extension: Extension, isActive: boolean): void {
    // Check if this toggle might cause the extension to be filtered out
    const currentFilter = this.store.activeFilter();
    const willBeFilteredOut =
      (currentFilter === 'active' && !isActive) ||
      (currentFilter === 'inactive' && isActive);

    if (willBeFilteredOut) {
      // Set flag to prevent default animation
      this.isToggleFilterInProgress = true;

      // Find the element for this extension using data attribute
      const element = this.extensionItems.find((item) => {
        const cardElement = item.nativeElement.querySelector('bem-card');
        return (
          cardElement &&
          cardElement.querySelector(
            '[data-extension-name="' + extension.name + '"]',
          )
        );
      })?.nativeElement;

      if (element) {
        // Store positions of all items before removal
        const items = this.extensionItems
          .toArray()
          .map((ref) => ref.nativeElement);

        const positions = items.map((item) => {
          const rect = item.getBoundingClientRect();
          return { element: item, left: rect.left, top: rect.top };
        });

        // Update the store to toggle the extension
        this.store.toggleExtensionActive(extension, isActive);

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
                onComplete:
                  index === currentItems.length - 1
                    ? () => {
                        // Reset the flag after animation completes
                        this.isToggleFilterInProgress = false;
                      }
                    : undefined,
              });
            }
          });

          // If no items to animate, reset the flag
          if (currentItems.length === 0) {
            this.isToggleFilterInProgress = false;
          }
        }, 0);
        return; // Skip the default store update
      }
    }

    // If not being filtered out or element not found, just update the store
    this.store.toggleExtensionActive(extension, isActive);
  }

  private animateItemsIn(): void {
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

  private setupObserver(): void {
    // Create a MutationObserver to watch for changes to the list
    this.observer = new MutationObserver((mutations) => {
      // Only animate if not currently handling a removal or toggle filter
      if (
        !this.isRemovalInProgress &&
        !this.isToggleFilterInProgress &&
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
