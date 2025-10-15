const selectTreeHelper = require("../../helpers/selectTree");
const ProductCategory = require("../../models/product-category.model");

module.exports.category = async (req, res, next) => {
  let find = {
    deleted: false,
    status: "active",
  };

  const records = await ProductCategory.find(find);
  const newRecords = selectTreeHelper(records);

  res.locals.layoutProductsCategory = newRecords;
  res.locals.category = records;

  next();
};
