import { Model, Document, Types as MongooseTypes } from "mongoose";

interface AboutUsT extends Document {
  body: string;
}

type AboutUsMethodsT = {};

type AboutUsModelT = Model<AboutUsT, {}, AboutUsMethodsT>;

export type { AboutUsT, AboutUsModelT, AboutUsMethodsT };
