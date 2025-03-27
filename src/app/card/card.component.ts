import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SwitchComponent } from '../switch/switch.component';

@Component({
  selector: 'bem-card',
  standalone: true,
  imports: [SwitchComponent],
  template: `
    <article
      class="rounded-20 bg-neutral-0 shadow-card flex h-[200px] flex-col justify-between border border-neutral-200 p-250 dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-none"
    >
      <div class="flex items-start justify-start gap-x-200">
        <img [src]="logo()" alt="" />

        <div class="flex flex-1 flex-col gap-y-100">
          <h2>{{ name() }}</h2>
          <p>{{ description() }}</p>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <button
          class="dark:text-neutral-0 hover:text-neutral-0 focus-visible:ring-ring inline-flex items-center justify-center rounded-full border border-neutral-200 px-200 py-100 transition-all duration-300 hover:border-transparent hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-offset-3 focus-visible:outline-none dark:border-neutral-600"
        >
          Remove
        </button>

        <bem-switch [modelValue]="isActive()" />
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  logo = input('logo-devlens.svg');
  name = input('DevLens');
  description = input(
    'Quickly inspect page layouts and visualize element boundaries.',
  );
  isActive = input(false);
}
