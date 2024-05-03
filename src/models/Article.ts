import {
  ArticleT,
  ArticleMethodsT,
  ArticleModelT,
} from "../types/models/blog.types";
import { model, Schema } from "mongoose";

const ArticleSchema = new Schema<ArticleT, ArticleModelT, ArticleMethodsT>(
  {
    title: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    category: {
      enum: ["blog", "projects"],
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Article = model<ArticleT, ArticleModelT>("Article", ArticleSchema);

export default Article;
