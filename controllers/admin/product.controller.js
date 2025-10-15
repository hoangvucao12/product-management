const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-category.model");
const selectTreeHelper = require("../../helpers/selectTree");
const Account = require("../../models/account.model");

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

  // Sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const product of products) {
    const userCreate = await Account.findOne({
      _id: product.createdBy.account_id,
    });
    if (userCreate) {
      product.accountFullName = userCreate.fullName;
    }

    if (product.updatedBy.length > 0) {
      const userUpdateNew = await Account.findOne({
        _id: product.updatedBy[product.updatedBy.length - 1].account_id,
      });
      if (userUpdateNew) {
        product.updatedBy[product.updatedBy.length - 1].accountFullName =
          userUpdateNew.fullName;
      }
    }
  }

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

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await Product.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );

  req.flash("success", "Cap nhat trang thai thanh cong!");

  let backURL = req.get("referer");
  res.redirect(`${backURL}`);
};

module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "active", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cap nhat trang thai thanh cong ${ids.length} san pham!`
      );
      break;
    case "unactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "unactive", $push: { updatedBy: updatedBy } }
      );
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
        await Product.updateOne(
          { _id: id },
          { position: position, $push: { updatedBy: updatedBy } }
        );
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
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash("success", "Xoa thanh cong san pham");

  let backURL = req.get("referer");
  res.redirect(`${backURL}`);
};

module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const category = selectTreeHelper(records);

  res.render("admin/pages/products/create", {
    titlePage: "Them moi san pham",
    category: category,
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

  req.body.createdBy = {
    account_id: res.locals.user.id,
  };

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

    let findCategory = {
      deleted: false,
    };

    const product = await Product.findOne(find);
    const records = await ProductCategory.find(findCategory);
    const category = selectTreeHelper(records);

    res.render("admin/pages/products/edit", {
      titlePage: "Chinh sua san pham",
      product: product,
      category: category,
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

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    await Product.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
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

    let categoryTitle = "";

    const product = await Product.findOne(find);
    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
      });
      categoryTitle = category.title;
    }

    res.render("admin/pages/products/detail", {
      titlePage: "Chi tiet san pham",
      product: product,
      categoryTitle: categoryTitle,
    });
  } catch (error) {
    req.flash("error", "Khong ton tai san pham nay!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
