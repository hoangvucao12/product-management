const Product = require("../../models/product.model");
const Category = require("../../models/product-category.model");
const productsHelper = require("../../helpers/product");
const getSubCategoryHelper = require("../../helpers/getSubCategory");

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    titlePage: "Trang san pham",
    products: newProducts,
  });
};

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      status: "active",
      slug: req.params.slugProduct,
    };

    const product = await Product.findOne(find);

    if (product.product_category_id) {
      const category = await Category.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: false,
      });

      product.category = category;
    }

    product.priceNew = productsHelper.priceNewProduct(product);

    res.render("client/pages/products/detail", {
      titlePage: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect("/products");
  }
};

module.exports.category = async (req, res) => {
  const category = await Category.findOne({
    slug: req.params.slugCategory,
    deleted: false,
    status: "active",
  });

  const listSubCategory = await getSubCategoryHelper.getCategory(category.id);
  const listSubCategoryId = listSubCategory.map((item) => item.id);

  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    titlePage: category.title,
    products: newProducts,
    listSubCategory: listSubCategory,
  });
};
