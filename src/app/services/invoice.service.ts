import { Injectable, signal, computed } from '@angular/core';

export interface InvoiceItem {
  id: string;
  description: string;
  price: number;
  qty: number;
  total: number;
}

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  billedTo: {
    name: string;
    phone: string;
    aadhar: string;
    address: string;
  };
  items: InvoiceItem[];
  discountPercent: number;
  gstPercent: number;
  adjustment: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  // State
  private state = signal<InvoiceData>({
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    billedTo: {
      name: '',
      phone: '',
      aadhar: '',
      address: ''
    },
    items: [this.createEmptyItem()],
    discountPercent: 5,
    gstPercent: 5,
    adjustment: 0
  });

  // Selectors
  readonly invoiceData = this.state.asReadonly();

  readonly subtotal = computed(() => {
    return this.state().items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  });

  readonly discountAmount = computed(() => {
    return this.subtotal() * (this.state().discountPercent / 100);
  });

  readonly amountAfterDiscount = computed(() => {
    return this.subtotal() - this.discountAmount();
  });

  readonly gstAmount = computed(() => {
    return this.amountAfterDiscount() * (this.state().gstPercent / 100);
  });

  readonly grandTotal = computed(() => {
    return this.amountAfterDiscount() + this.gstAmount() + this.state().adjustment;
  });

  // Actions
  updateData(newData: Partial<InvoiceData>) {
    this.state.update(s => ({ ...s, ...newData }));
  }

  updateBilledTo(billedToData: Partial<InvoiceData['billedTo']>) {
    this.state.update(s => ({
      ...s,
      billedTo: { ...s.billedTo, ...billedToData }
    }));
  }

  updateItem(index: number, itemUpdate: Partial<InvoiceItem>) {
    this.state.update(s => {
      const items = [...s.items];
      if (items[index]) {
        items[index] = { ...items[index], ...itemUpdate };
        items[index].total = items[index].price * items[index].qty;
      }
      return { ...s, items };
    });
  }

  addItem() {
    this.state.update(s => {
      const items = [...s.items];
      if (items.length < 9) {
        items.push(this.createEmptyItem());
      }
      return { ...s, items };
    });
  }

  removeItem(index: number) {
    this.state.update(s => {
      const items = [...s.items];
      if (items.length > 1) {
        items.splice(index, 1);
      }
      return { ...s, items };
    });
  }

  reset() {
    this.state.set({
      invoiceNo: '',
      date: new Date().toISOString().split('T')[0],
      billedTo: {
        name: '',
        phone: '',
        aadhar: '',
        address: ''
      },
      items: [this.createEmptyItem()],
      discountPercent: 5,
      gstPercent: 5,
      adjustment: 0
    });
  }

  private createEmptyItem(): InvoiceItem {
    return {
      id: Math.random().toString(36).substring(2, 9),
      description: '',
      price: 0,
      qty: 1,
      total: 0
    };
  }
}
