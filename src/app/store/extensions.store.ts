import { Extension } from '@core/types';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import data from '../../../data/data.json';

type ExtensionsState = {
  extensions: Extension[];
  isLoading: boolean;
};
const initialState: ExtensionsState = {
  extensions: data,
  isLoading: false,
};

export const ExtensionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
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
    },
    loadExtensions(extensions: Extension[]) {
      patchState(store, { extensions });
    },
  })),
);
