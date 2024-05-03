import { AboutUs } from "../models";
import { Async } from "../lib";

export const editAboutUs = Async(async (req, res, next) => {
  const { body } = req.body;

  let data: any = await AboutUs.find();

  if (!data[0]) data = await new AboutUs({ body }).save();
  else
    data = await AboutUs.findByIdAndUpdate(
      data[0]._id,
      { $set: { body } },
      { new: true }
    );

  res.status(201).json({ body: data.body });
});

export const getAboutUs = Async(async (req, res, next) => {
  const data = await AboutUs.find();

  res.status(200).json(data[0]);
});
