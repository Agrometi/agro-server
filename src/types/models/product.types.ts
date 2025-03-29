import { Model, Document, Types as MongooseTypes } from "mongoose";

interface ProductT extends Document {
  title: string;
  description: string;
  sizeUnit: string;
  sizes: Array<number>;
  price: number;
  assets: Array<string>;
  category: MongooseTypes.ObjectId;
  updatedAt: string;
}

type ProductMethodsT = {};

type ProductModelT = Model<ProductT, {}, ProductMethodsT>;

export type { ProductT, ProductModelT, ProductMethodsT };
