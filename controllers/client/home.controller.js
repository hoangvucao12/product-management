const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");

module.exports.index = async (req, res) => {
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(4);

  const newProducts = productsHelper.priceNewProducts(productsFeatured);

  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(8);

  const newProductsNew = productsHelper.priceNewProducts(productsNew);

  res.render("client/pages/home/index", {
    titlePage: "Trang chu",
    productsFeatured: newProducts,
    productsNew: newProductsNew,
  });
};
