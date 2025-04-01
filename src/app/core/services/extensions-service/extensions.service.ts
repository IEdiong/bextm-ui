import { Injectable } from '@angular/core';
import { Extension } from '@core/types';
import data from '../../../../../data/data.json';

@Injectable({
  providedIn: 'root',
})
export class ExtensionsService {
  getStoredExtensions(): Extension[] {
    const extensions = localStorage.getItem('extensions');

    if (!extensions) {
      this.persistExtensions(data);
      return data;
    }

    return JSON.parse(extensions) as Extension[];
  }

  persistExtensions(updatedExtensions: Extension[]): void {
    localStorage.setItem('extensions', JSON.stringify(updatedExtensions));
  }
}
