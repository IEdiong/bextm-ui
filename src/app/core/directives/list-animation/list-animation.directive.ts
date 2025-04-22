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
      this.animateItemsIn();
    });
  }

  public animateItemsIn(): void {
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
   * Retrieves all elements matching the item selector within the host element.
   * @returns An array of HTMLElements that match the selector.
   */
  private getItems(): HTMLElement[] {
    return Array.from(
      this.el.nativeElement.querySelectorAll(this.itemSelector()),
    );
  }
}
