import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';

interface FilterOption {
  key: string;
  label: string;
  ariaLabel: string;
  queryParam: string | null;
}

@Component({
  selector: 'bem-filter-toolbar',
  standalone: true,
  imports: [],
  template: `
    <div
      class="tablet:items-center tablet:flex-row tablet:justify-between tablet:gap-y-0 flex flex-col gap-y-300 text-center"
    >
      <h1 class="dark:text-neutral-0 text-neutral-900">Extensions List</h1>
      <div
        class="flex items-center justify-center gap-x-150"
        tabindex="-1"
        role="group"
        aria-label="Filter options"
      >
        @for (option of filterOptions(); track option.key) {
          <button
            class="filter-btn"
            (click)="setFilter(option)"
            [class.filter-btn__active]="option.key === activeFilter()"
            [ariaPressed]="option.key === activeFilter()"
            [ariaLabel]="option.ariaLabel"
          >
            {{ option.label }}
          </button>
        }
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
export class FilterToolbarComponent {
  // Define your filter options
  filterOptions = signal<FilterOption[]>([
    { key: 'all', label: 'All', ariaLabel: 'All extensions', queryParam: null },
    {
      key: 'active',
      label: 'Active',
      ariaLabel: 'Active extensions',
      queryParam: 'active',
    },
    {
      key: 'inactive',
      label: 'Inactive',
      ariaLabel: 'Inactive extensions',
      queryParam: 'inactive',
    },
  ]);

  // Track the active filter
  activeFilter = signal<string>('all');

  constructor(private router: Router) {
    // Initialize from URL on component load
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter');

    if (filterParam) {
      const matchingOption = this.filterOptions().find(
        (opt) => opt.queryParam === filterParam,
      );

      if (matchingOption) {
        this.activeFilter.set(matchingOption.key);
      }
    }
  }

  setFilter(option: FilterOption) {
    this.activeFilter.set(option.key);

    // Update URL
    this.router.navigate([], {
      queryParams: { filter: option.queryParam },
      queryParamsHandling: 'merge',
    });
  }
}
