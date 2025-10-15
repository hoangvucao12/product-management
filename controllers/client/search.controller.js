const Product = require("../../models/product.model");
const Category = require("../../models/product-category.model");
const productsHelper = require("../../helpers/product");
const getSubCategoryHelper = require("../../helpers/getSubCategory");

module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let newProducts = [];

  if (keyword) {
    const regex = new RegExp(keyword, "i");
    const products = await Product.find({
      title: regex,
      deleted: false,
      status: "active",
    });

    newProducts = productsHelper.priceNewProducts(products);
  }

  res.render("client/pages/search/index", {
    titlePage: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts,
  });
};
