interface Shipping {
  title: string
  price: number
}

// товарная позиция, необязательное поле
interface ReceiptItem {
  title: string // name of product or service
  price: number // price for a product or service, price should be described in UZT (TIYIN)
  discount: number // discount for product or service in UZT
  count: number // quantity item
  code: string // MXIK code (ИКПУ), mandatory field
  package_code: string
  vat_percent: number
  // units?: number // значение изменится в зависимости от вида товара
}

export interface OfdReceipt {
  receipt_type: 0, // тип фискального чека
  shipping?: Shipping,
  items: ReceiptItem[]
}
