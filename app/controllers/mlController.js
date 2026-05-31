const { predictCategory } = require("../ml/model");

exports.predictCategoryApi = (req, res) => {
  const { description } = req.body;
  if (!description?.trim()) {
    return res.status(400).json({ message: "Description is required" });
  }
  const category = predictCategory(description);
  return res.json({ category });
};
