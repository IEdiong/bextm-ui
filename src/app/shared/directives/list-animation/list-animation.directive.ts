import {
  afterNextRender,
  computed,
  Directive,
  ElementRef,
  input,
  OnDestroy,
} from '@angular/core';

import gsap from 'gsap';

/**
 * Configuration interface for list animation directive
 */
export interface ListAnimationConfig {
  /** Duration for individual item animations */
  duration?: number;
  /** Stagger time between item animations */
  stagger?: number;
  /** GSAP easing function to use */
  ease?: string;
  /** Initial Y translation for items entering */
  initialY?: number;
  /** Whether to animate item positions when list changes */
  animatePositions?: boolean;
}

@Directive({
  selector: '[bemListAnimation]',
  standalone: true,
  exportAs: 'listAnimation',
})
export class ListAnimationDirective implements OnDestroy {
  animationConfig = input<ListAnimationConfig>({});
  itemSelector = input<string>('li');

  private timeline: gsap.core.Timeline | null = null;
  private observer: MutationObserver | null = null;
  private isAnimatingRemoval = false;
  private previousPositions: Array<{ element: HTMLElement; rect: DOMRect }> =
    [];
  private config = computed(() => ({
    duration: this.animationConfig().duration ?? 0.5,
    stagger: this.animationConfig().stagger ?? 0.08,
    ease: this.animationConfig().ease ?? 'power2.out',
    initialY: this.animationConfig().initialY ?? 20,
    animatePositions: this.animationConfig().animatePositions ?? true,
  }));

  constructor(private el: ElementRef) {
    afterNextRender(() => {
      // Initial animation of items
      this.animateItemsIn();

      // Set up observer to detect changes in the list
      this.setupObserver();
    });
  }

  ngOnDestroy(): void {
    // Disconnect the observer if it exists
    if (this.observer) {
      this.observer.disconnect();
    }

    // Clean up GSAP timeline if it exists
    if (this.timeline) {
      this.timeline.kill();
    }
  }

  prepareForRemoval(): void {
    this.isAnimatingRemoval = true;
    this.savePositions();
  }

  animatePositions(): void {
    const currentItems = this.getItems();

    if (!this.config().animatePositions || !currentItems.length) {
      // Reset flag if we are not animating
      this.isAnimatingRemoval = false;
      return;
    }

    currentItems.forEach((item, index) => {
      const prevData = this.previousPositions.find(
        (pos) => pos.element === item,
      );

      if (prevData) {
        const prevRect = prevData.rect;
        const newRect = item.getBoundingClientRect();

        const deltaX = prevRect.left - newRect.left;
        const deltaY = prevRect.top - newRect.top;

        // Only animate if the position actually changed
        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
          // Set initial position (where it was before)
          gsap.set(item, { x: deltaX, y: deltaY });

          // Animate to new position with stagger based on grid distance
          gsap.to(item, {
            x: 0,
            y: 0,
            duration: this.config().duration,
            ease: this.config().ease,
            delay: index * (this.config().stagger / 2),
            onComplete:
              index === currentItems.length - 1
                ? () => {
                    // Reset the flag after animation completes
                    this.isAnimatingRemoval = false;
                  }
                : undefined,
          });
        }
      } else {
        // New item that wasn't in previous positions
        gsap.fromTo(
          item,
          { opacity: 0, y: this.config().initialY },
          {
            opacity: 1,
            y: 0,
            duration: this.config().duration,
            ease: this.config().ease,
            delay: index * this.config().stagger,
          },
        );
      }
    });

    // If no items to animate, reset flag and return
    if (currentItems.length === 0) {
      this.isAnimatingRemoval = false;
    }
  }

  animateItemsOut(item: HTMLElement, onComplete?: () => void): void {
    gsap.to(item, {
      opacity: 0,
      y: -20,
      scale: 0.8,
      duration: this.config().duration,
      ease: this.config().ease,
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });
  }

  private savePositions(): void {
    this.previousPositions = this.getItems().map((element) => ({
      element,
      rect: element.getBoundingClientRect(),
    }));
  }

  /**
   * Animates a list of items into view using GSAP
   * (GreenSock Animation Platform).
   *
   * This method resets the items to their initial state and then animates them
   * into view with a staggered effect. If a timeline already exists, it is
   * killed before creating a new one.
   *
   * @remarks
   * - The animation properties such as `initialY`, `duration`, `stagger`, and
   *   `ease` are retrieved from the `config` method.
   * - The items to be animated are fetched using the `getItems` method.
   *
   * @throws Will not perform any animation if no items are found.
   */
  private animateItemsIn(): void {
    if (this.timeline) {
      this.timeline.kill();
    }

    const items = this.getItems();
    if (!items.length) return;

    this.timeline = gsap.timeline();

    // Reset items to initial state
    gsap.set(items, {
      opacity: 0,
      y: this.config().initialY,
    });

    // Animate items in with stagger
    this.timeline.to(items, {
      opacity: 1,
      y: 0,
      duration: this.config().duration,
      stagger: this.config().stagger,
      ease: this.config().ease,
    });
  }

  /**
   * Sets up a `MutationObserver` to monitor changes in the child elements of the host element.
   * The observer triggers an animation when child elements are added or removed.
   *
   * @private
   * @remarks
   * - The observer listens for `childList` mutations and checks if nodes are added or removed.
   * - If changes are detected, the `animateItemsIn` method is called to handle animations.
   *
   * @returns {void}
   */
  private setupObserver(): void {
    // Create a MutationObserver to watch for changes in the list
    this.observer = new MutationObserver((mutations) => {
      // Only animate if not currently handling a removal or toggle filter
      if (
        !this.isAnimatingRemoval &&
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

    // Observe the host element for child list changes
    const container = this.el.nativeElement;
    if (container) {
      this.observer.observe(container, {
        childList: true,
        subtree: false,
      });
    }
  }

  /**
   * Retrieves all elements matching the item selector within the host element.
   * @returns An array of HTMLElements that match the selector.
   */
  private getItems(): HTMLElement[] {
    return Array.from(
      this.el.nativeElement.querySelectorAll(this.itemSelector()),
    );
  }
}
