import {
  Component,
  forwardRef,
  input,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'bem-switch',
  standalone: true,
  imports: [NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
  template: `
    <button
      role="switch"
      [attr.aria-checked]="value()"
      [attr.aria-label]="label()"
      [attr.aria-disabled]="disabled()"
      [disabled]="disabled()"
      (click)="toggle()"
      (keydown.space)="toggle(); $event.preventDefault()"
      class="group focus-visible:ring-ring flex h-250 w-[36px] cursor-pointer items-center rounded-full p-25 transition-colors duration-300 ease-in-out focus:ring-offset-2 focus:outline-none focus-visible:ring-2"
      [ngClass]="{
        'bg-neutral-300 dark:bg-neutral-600': !value() && !disabled(),
        'bg-red-700 hover:bg-red-500 dark:bg-red-400': value() && !disabled(),
        'bg-neutral-100': disabled(),
        'cursor-pointer': !disabled(),
        'cursor-not-allowed': disabled(),
      }"
    >
      <span
        aria-hidden="true"
        class="block size-200 transform rounded-full transition-transform duration-300 ease-in-out"
        [ngClass]="{
          'translate-x-200': value(),
          'shadow-thumb translate-x-0': !value(),
          'shadow-thumb bg-[#fafafa]': disabled(),
          'shadow-thumb-active': value() && !disabled(),
          'bg-neutral-0 group-hover:bg-white focus-visible:bg-white':
            !disabled(),
        }"
      ></span>
    </button>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent implements ControlValueAccessor {
  label = input('Toggle');
  disabled = input(false);

  value = signal(false);
  private internalDisabled = signal(false);

  isDisabled(): boolean {
    return this.disabled() || this.internalDisabled();
  }

  toggle(): void {
    if (this.isDisabled()) return;

    this.value.set(!this.value());
    this.onChange(this.value());
    this.onTouched();
  }

  // ControlValueAccessor implementation
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }
}
