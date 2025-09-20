const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

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
  const countProductCategory = await ProductCategory.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      limitItems: 4,
      currentPage: 1,
    },
    req.query,
    countProductCategory
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

  const records = await ProductCategory.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/product-category/index", {
    titlePage: "Danh muc san pham",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await ProductCategory.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cap nhat trang thai thanh cong!");

  let backURL = req.get("referer");
  res.redirect(`${backURL}`);
};

module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { status: "active" }
      );
      req.flash(
        "success",
        `Cap nhat trang thai thanh cong ${ids.length} danh muc!`
      );
      break;
    case "unactive":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { status: "unactive" }
      );
      req.flash(
        "success",
        `Cap nhat trang thai thanh cong ${ids.length} danh muc!`
      );
      break;
    case "delete-all":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deletedAt: new Date() }
      );
      req.flash("success", `Xoa thanh cong ${ids.length} danh muc!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ProductCategory.updateOne({ _id: id }, { position: position });
      }
      req.flash(
        "success",
        `Cap nhat vi tri thanh cong ${ids.length} danh muc!`
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

  await ProductCategory.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  req.flash("success", "Xoa thanh cong san pham");

  let backURL = req.get("referer");

  res.redirect(`${backURL}`);
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/product-category/create", {
    titlePage: "Tao danh muc san pham",
  });
};

module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countProducts = await ProductCategory.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const records = new ProductCategory(req.body);
  await records.save();

  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
};

module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const records = await ProductCategory.findOne(find);

    res.render("admin/pages/product-category/edit", {
      titlePage: "Chinh sua danh muc",
      records: records,
    });
  } catch (error) {
    req.flash("error", "Khong ton tai danh muc nay!");
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};

module.exports.editPatch = async (req, res) => {
  req.body.position = parseInt(req.body.position);

  try {
    await ProductCategory.updateOne({ _id: req.params.id }, req.body);
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

    const records = await ProductCategory.findOne(find);

    res.render("admin/pages/product-category/detail", {
      titlePage: "Chi tiet danh muc",
      records: records,
    });
  } catch (error) {
    req.flash("error", "Khong ton tai danh muc nay!");
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};
