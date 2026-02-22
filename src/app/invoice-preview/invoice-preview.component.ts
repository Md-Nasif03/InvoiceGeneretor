import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.css']
})
export class InvoicePreviewComponent {
  invoiceService = inject(InvoiceService);

  get invoiceData() {
    return this.invoiceService.invoiceData();
  }

  get subtotal() {
    return this.invoiceService.subtotal();
  }

  get discountAmount() {
    return this.invoiceService.discountAmount();
  }

  get gstAmount() {
    return this.invoiceService.gstAmount();
  }

  get grandTotal() {
    return this.invoiceService.grandTotal();
  }
}
