const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  //status
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }
  //End status

  //search
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  //End search

  //pagination
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      limitItems: 4,
      currentPage: 1,
    },
    req.query,
    countProducts
  );
  //End pagination

  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index", {
    titlePage: "Danh sach san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cap nhat trang thai thanh cong!");

  let backURL = req.get("referer");

  res.redirect(`${backURL}`);
};

module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash(
        "success",
        `Cap nhat trang thai thanh cong ${ids.length} san pham!`
      );
      break;
    case "unactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "unactive" });
      req.flash(
        "success",
        `Cap nhat trang thai thanh cong ${ids.length} san pham!`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deletedAt: new Date() }
      );
      req.flash("success", `Xoa thanh cong ${ids.length} san pham!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash(
        "success",
        `Cap nhat vi tri thanh cong ${ids.length} san pham!`
      );
      break;
    default:
      break;
  }
  let backURL = req.get("referer");

  res.redirect(`${backURL}`);
};

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  req.flash("success", "Xoa thanh cong san pham");

  let backURL = req.get("referer");

  res.redirect(`${backURL}`);
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    titlePage: "Them moi san pham",
  });
};

module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/edit", {
      titlePage: "Chinh sua san pham",
      product: product,
    });
  } catch (error) {
    req.flash("error", "Khong ton tai san pham nay!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await Product.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Cap nhat thanh cong!");
  } catch (error) {
    req.flash("error", "Cap nhat that bai!");
  }

  let backURL = req.get("referer");
  res.redirect(`${backURL}`);
};

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      titlePage: "Chi tiet san pham",
      product: product,
    });
  } catch (error) {
    req.flash("error", "Khong ton tai san pham nay!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
