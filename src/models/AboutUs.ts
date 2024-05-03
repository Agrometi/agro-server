import {
  AboutUsT,
  AboutUsModelT,
  AboutUsMethodsT,
} from "../types/models/aboutUs.types";
import { model, Schema } from "mongoose";

const AboutUsSchema = new Schema<AboutUsT, AboutUsModelT, AboutUsMethodsT>({
  body: String,
});

const AboutUs = model<AboutUsT, AboutUsModelT>("AboutUs", AboutUsSchema);

export default AboutUs;
