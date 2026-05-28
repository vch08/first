export type CreateAdvertInput = {
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  seller: string;
  email: string;
  image?: string;
  imageFile?: File | null;
  accountNumber: string;
  paymentMessage: string;
};
