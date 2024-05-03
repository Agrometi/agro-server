import { Document, Model } from "mongoose";

interface ArticleT extends Document {
  title: string;
  body: string;
  category: string;
}

type ArticleMethodsT = {};

type ArticleModelT = Model<ArticleT, {}, ArticleMethodsT>;

export type { ArticleT, ArticleMethodsT, ArticleModelT };
