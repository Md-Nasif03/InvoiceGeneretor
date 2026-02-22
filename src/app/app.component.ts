import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, InvoiceFormComponent, InvoicePreviewComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'InvoiceGenerator';
}
