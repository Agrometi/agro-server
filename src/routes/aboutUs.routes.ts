import { Router as ExpressRouter } from "express";
import { checkAuth } from "../middlewares";
import * as aboutUsController from "../controllers/aboutUs.controller";

const Router = ExpressRouter();

Router.route("/")
  .post(checkAuth, aboutUsController.editAboutUs)
  .get(aboutUsController.getAboutUs);

export default Router;
