import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService, InvoiceData } from '../services/invoice.service';
import { PdfService } from '../services/pdf.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {
  invoiceService = inject(InvoiceService);
  pdfService = inject(PdfService);

  // Expose JS Number object to template
  readonly Number = Number;

  // Local mutable copy of data to prevent input focus loss caused by signal instance replacement
  localData!: InvoiceData;

  constructor() {
    // Sync local data whenever the service's signal updates completely (e.g. on reset or add/remove row)
    // We only want to track structural changes, but to be safe we'll initialize here and on reset.
    effect(() => {
      const data = this.invoiceService.invoiceData();
      // Only do a deep clone if items length changed or it's a completely new state (like reset)
      // If we deep clone everything on every keystroke, input loses focus.
      if (!this.localData || this.localData.items.length !== data.items.length || this.localData.invoiceNo !== data.invoiceNo && data.invoiceNo === '') {
        this.localData = JSON.parse(JSON.stringify(data));
      }
    });
  }

  ngOnInit() {
    if (!this.localData) {
      this.localData = JSON.parse(JSON.stringify(this.invoiceService.invoiceData()));
    }
  }

  // --- Sync methods called on (ngModelChange) ---

  onGlobalDataChange(field: keyof InvoiceData, value: any) {
    (this.localData as any)[field] = value;
    this.invoiceService.updateData({ [field]: value });
  }

  onBilledToChange(field: string, value: string) {
    (this.localData.billedTo as any)[field] = value;
    this.invoiceService.updateBilledTo({ [field]: value });
  }

  onItemChange(index: number, field: string, value: any) {
    // If it's a number field, we parse it or allow empty string briefly during typing
    let parsedValue = value;
    if (field === 'price' || field === 'qty') {
      // Don't force '0' immediately if user deletes to allow typing '-' or empty
      parsedValue = value === '' || value === '-' ? value : Number(value);
    }

    (this.localData.items[index] as any)[field] = parsedValue;

    // Only update service with valid numbers for calculation
    const serviceValue = field === 'price' || field === 'qty' ? (Number(value) || 0) : parsedValue;
    this.invoiceService.updateItem(index, { [field]: serviceValue });
  }

  // --- Actions ---

  addItem() {
    this.invoiceService.addItem();
  }

  removeItem(index: number) {
    this.invoiceService.removeItem(index);
  }

  resetForm() {
    this.invoiceService.reset();
  }

  async generatePdf() {
    const fileName = `Invoice_${this.localData.invoiceNo || 'Draft'}.pdf`;
    await this.pdfService.generatePdf('invoiceContent', fileName);
  }
}
