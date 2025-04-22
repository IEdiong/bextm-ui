import {
  afterNextRender,
  computed,
  Directive,
  ElementRef,
  input,
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
})
export class ListAnimationDirective {
  animationConfig = input<ListAnimationConfig>({});
  itemSelector = input<string>('li');

  private timeline: gsap.core.Timeline | null = null;
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
    const observer = new MutationObserver((mutations) => {
      // Only animate if not currently handling a removal or toggle filter
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

    // Observe the host element for child list changes
    const container = this.el.nativeElement;
    if (container) {
      observer.observe(container, {
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
