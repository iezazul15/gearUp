export type Currency = "BDT" | "USD" | "EUR" | "SGD" | "INR" | "MYR";

export type ProductProfile =
  "general" | "physical-goods" | "non-physical-goods";

export type Gateway =
  | "visacard"
  | "mastercard"
  | "amexcard"
  | "mobilebank"
  | "internetbank"
  | "othercard"
  | "bkash"
  | "upay";

export interface SSLCommerzPayment {
  // Store Credentials
  store_id: string;
  store_passwd: string;

  // Transaction
  total_amount: number;
  currency: Currency;
  tran_id: string;

  // Callback URLs
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url?: string;

  // Product
  product_name: string;
  product_category: string;
  product_profile: ProductProfile;

  // Customer
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_add2?: string;
  cus_city: string;
  cus_state?: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
  cus_fax?: string;

  // Shipping (Always YES)
  shipping_method: "YES";

  ship_name: string;
  ship_add1: string;
  ship_add2?: string;
  ship_area: string;
  ship_city: string;
  ship_sub_city: string;
  ship_state?: string;
  ship_postcode: string;
  ship_country: string;

  // Payment Gateway (optional)
  multi_card_name?: Gateway | `${Gateway},${string}`;
  allowed_bin?: string;

  // EMI
  emi_option?: 0 | 1;
  emi_max_inst_option?: number;
  emi_selected_inst?: number;
  emi_allow_only?: 0 | 1;

  // Invoice Breakdown (optional)
  product_amount?: number;
  vat?: number;
  discount_amount?: number;
  convenience_fee?: number;

  // Custom Metadata
  value_a?: string;
  value_b?: string;
  value_c?: string;
  value_d?: string;
}
