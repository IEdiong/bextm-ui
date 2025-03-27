import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bem-filter-toolbar',
  standalone: true,
  imports: [],
  template: `
    <div class="space-y-300 text-center">
      <h1 class="dark:text-neutral-0 text-neutral-900">Extensions List</h1>
      <div class="flex items-center justify-center gap-x-150">
        <button class="filter-btn filter-btn__active">All</button>
        <button class="filter-btn">Active</button>
        <button class="filter-btn">Inactive</button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterToolbarComponent {}
