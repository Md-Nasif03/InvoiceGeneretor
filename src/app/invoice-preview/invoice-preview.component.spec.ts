import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePreviewComponent } from './invoice-preview.component';

describe('InvoicePreviewComponent', () => {
  let component: InvoicePreviewComponent;
  let fixture: ComponentFixture<InvoicePreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoicePreviewComponent]
    });
    fixture = TestBed.createComponent(InvoicePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
