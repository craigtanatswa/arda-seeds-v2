export interface ProductPackSize {
  size: string   // e.g. "2kg", "5kg", "10kg"
  price: number  // retail price in USD
}

export interface Product {
  id: string
  name: string
  category: string
  shortDescription: string
  fullDescription: string
  maturity: string
  yieldPotential: string
  features: string[]
  regions: string[]
  image: string
  featured: boolean
  packSizes?: ProductPackSize[]
}

export interface CartItem {
  productId: string
  productName: string
  category: string
  packSize: string
  pricePerUnit: number
  quantity: number
}

export interface OrderRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  items: CartItem[]
  total: number
}

export interface QuoteRequest {
  fullName: string
  email: string
  phone: string
  company?: string
  address: string
  products: {
    productId: string
    quantity: number
  }[]
  message?: string
}

export interface GrowerRegistration {
  fullName: string
  email: string
  phone: string
  farmName: string
  farmLocation: string
  farmSize: string
  cropsGrown: string[]
  previousSupplier?: string
  message?: string
}
