import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionListComponent } from './extension-list.component';

describe('ExtensionListComponent', () => {
  let component: ExtensionListComponent;
  let fixture: ComponentFixture<ExtensionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtensionListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExtensionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
