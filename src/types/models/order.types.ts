import { Model, Document, Types as MongooseTypes } from "mongoose";

interface OrderT extends Document {
  invoiceNumber: string;
  products: Array<OrderProductT>;
  customerName: string;
  customerAddress: string;
  customerPhone: EncryptedFieldT;
  customerId: EncryptedFieldT;
  totalPrice: number;
  status: string;
}

type EncryptedFieldT = { value: string; iv: string; key: string };

type DecryptOrderParamsT = { phone: EncryptedFieldT; id: EncryptedFieldT };

type OrderMethodsT = {
  decryptOrder: (params: DecryptOrderParamsT) => { phone: string; id: string };
};

type OrderModelT = Model<OrderT, {}, OrderMethodsT>;

type OrderProductT = {
  productType: string;
  productId: string;
  quantity: number;
  size: string;
  sizeUnit: string;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
};

export type {
  OrderT,
  OrderModelT,
  OrderMethodsT,
  OrderProductT,
  EncryptedFieldT,
};
