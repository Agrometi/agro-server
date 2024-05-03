import { Async, AppError, API_Features } from "../lib";
import { Article } from "../models";

export const createArticle = Async(async (req, res, next) => {
  const { title, body, category } = req.body;

  await new Article({ title, body, category }).save();

  res.status(201).json("New article is  added");
});

export const updateArticle = Async(async (req, res, next) => {
  const { articleId } = req.params;
  const { title, body, category } = req.body;

  const article = await Article.findByIdAndUpdate(articleId, {
    $set: { title, body, category },
  });

  if (!article) return next(new AppError(404, "article does not exists"));

  res.status(201).json("article is updated");
});

export const deleteArticle = Async(async (req, res, next) => {
  const { articleId } = req.params;

  const article = await Article.findByIdAndDelete(articleId);

  if (!article) return next(new AppError(404, "article does not exists"));

  res.status(204).json("article is deleted");
});

export const getArticle = Async(async (req, res, next) => {
  const { articleId } = req.params;

  const article = await Article.findById(articleId);

  if (!article) return next(new AppError(404, "article does not exists"));

  res.status(200).json(article);
});

export const getAllArticles = Async(async (req, res, next) => {
  const query = new API_Features(
    Article.find(),
    req.query as { [key: string]: string }
  );

  const articles = await query.paginate().articlesFilter().sort().getQuery();
  const { currentPage, pagesCount } = await query.countDocuments();

  res
    .status(200)
    .json({ data: articles, currentPage, hasMore: currentPage < pagesCount });
});
