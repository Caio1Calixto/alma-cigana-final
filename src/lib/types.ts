export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  details: string | null;
  material: string | null;
  price: number;
  image: string;
  featured: boolean;
  categoryId: number;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  order: number;
  products: Product[];
}

export interface OrderItemInfo {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderInfo {
  id: number;
  code: string;
  customerName: string;
  email: string;
  phone: string;
  cep: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  paymentMethod: string;
  notes: string | null;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode: string | null;
  status: string;
  createdAt: string;
  items: OrderItemInfo[];
}
