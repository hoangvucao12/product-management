const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");

module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = req.body.quantity;
  const cartId = req.cookies.cartId;

  const objectCart = {
    product_id: productId,
    quantity: quantity,
  };

  let result = await Cart.updateOne(
    { _id: cartId, "products.product_id": productId },
    { $inc: { "products.$.quantity": quantity } }
  );

  if (result.modifiedCount === 0) {
    await Cart.updateOne({ _id: cartId }, { $push: { products: objectCart } });
  }

  req.flash("success", "Đã thêm sản phẩm vào giỏ hàng!");
  let backURL = req.get("referer");
  res.redirect(`${backURL}`);
};

module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
        deleted: false,
        status: "active",
      }).select("title thumbnail slug price discountPercentage");

      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;

      item.totalPrice = productInfo.priceNew * item.quantity;
    }
  }

  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  res.render("client/pages/cart/index", {
    titlePage: "Giỏ hàng",
    cartDetail: cart,
  });
};

module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.id;

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { product_id: productId } },
    }
  );

  req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");

  let backURL = req.get("referer");
  res.redirect(`${backURL}`);
};

module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.id;
  const quantity = req.params.quantity;

  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      $set: {
        "products.$.quantity": quantity,
      },
    }
  );

  req.flash("success", "Cập nhật số lượng thành công!");
  let backURL = req.get("referer");
  res.redirect(`${backURL}`);
};
