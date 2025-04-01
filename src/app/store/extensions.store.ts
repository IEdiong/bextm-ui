import { Extension, FilterType } from '@core/types';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ExtensionsService } from '@core/services/extensions-service/extensions.service';
import { computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type ExtensionsState = {
  extensions: Extension[];
  activeFilter: FilterType;
};

const initialState: ExtensionsState = {
  extensions: [],
  activeFilter: undefined,
};

export const ExtensionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, extensionsService = inject(ExtensionsService)) => ({
    toggleExtensionActive(extToUpdate: Extension, setToActive: boolean) {
      // console.log('Extension to change :::', extToUpdate);
      // console.log('New state change :::', setToActive);
      const updatedExtensions = [
        ...store
          .extensions()
          .map((ext) =>
            ext.name === extToUpdate.name
              ? { ...ext, isActive: setToActive }
              : ext,
          ),
      ];

      patchState(store, { extensions: updatedExtensions });
      extensionsService.persistExtensions(updatedExtensions);
    },
  })),
  withComputed(({ extensions, activeFilter }) => ({
    filteredExtensions: computed(() => {
      const filter = activeFilter();
      const allExtensions = extensions();

      if (filter === 'active') {
        return allExtensions.filter((extension) => extension.isActive);
      } else if (filter === 'inactive') {
        return allExtensions.filter((extension) => !extension.isActive);
      }

      return allExtensions;
    }),
  })),
  withHooks({
    onInit(
      store,
      route = inject(ActivatedRoute),
      extensionsService = inject(ExtensionsService),
    ) {
      route.queryParams.subscribe((params) => {
        const filter = params['filter'] as FilterType;
        // console.log('Filter value =>', filter);

        patchState(store, { activeFilter: filter });
      });

      patchState(store, {
        extensions: extensionsService.getStoredExtensions(),
      });
    },
  }),
);
