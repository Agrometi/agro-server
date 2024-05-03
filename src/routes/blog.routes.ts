import { Router as ExpressRouter } from "express";
import * as blogController from "../controllers/blog.controller";
import { checkAuth } from "../middlewares";

const Router = ExpressRouter();

Router.route("/")
  .post(checkAuth, blogController.createArticle)
  .get(blogController.getAllArticles);

Router.route("/:articleId")
  .put(checkAuth, blogController.updateArticle)
  .delete(checkAuth, blogController.deleteArticle)
  .get(blogController.getArticle);

export default Router;
