import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import { CardComponent } from '../card/card.component';
import data from '../../../data/data.json';
import { ActivatedRoute, Router } from '@angular/router';

interface IExtension {
  logo: string;
  name: string;
  description: string;
  isActive: boolean;
}

@Component({
  selector: 'bem-extension-list',
  standalone: true,
  imports: [CardComponent],
  template: `
    <ul class="extensions-container">
      @for (extension of filteredExtensionList(); track extension.name) {
        <li>
          <bem-card
            [logo]="extension.logo"
            [name]="extension.name"
            [description]="extension.description"
            [isActive]="extension.isActive"
          />
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtensionListComponent implements OnInit {
  // Keep the original extensions as a signal
  private extensions = signal<IExtension[]>(data);

  // Create a signal for the current filter
  private filterSignal = signal<'active' | 'inactive' | undefined>(undefined);

  // Use computed to create a reactive filtered list
  filteredExtensionList = computed(() => {
    const filter = this.filterSignal();
    const allExtensions = this.extensions();

    if (filter === 'active') {
      return allExtensions.filter((extension) => extension.isActive);
    } else if (filter === 'inactive') {
      return allExtensions.filter((extension) => !extension.isActive);
    }

    return allExtensions;
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Subscribe to query params and update the filter signal
    this.route.queryParams.subscribe((params) => {
      const filter = params['filter'] as 'active' | 'inactive' | undefined;
      // console.log('Filter value =>', filter);

      // Update the filter signal, which will automatically update filteredExtensionList
      this.filterSignal.set(filter);
    });
  }
}
