const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select("-password-token");

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index", {
    titlePage: "Danh sach tai khoan",
    records: records,
  });
};

module.exports.create = async (req, res) => {
  find = {
    deleted: false,
  };

  const roles = await Role.find(find);

  res.render("admin/pages/accounts/create", {
    titlePage: "Tao moi tai khoan",
    roles: roles,
  });
};

module.exports.createPost = async (req, res) => {
  req.body.password = md5(req.body.password);
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", "Email da ton tai");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
  } else {
    const records = new Account(req.body);
    await records.save();

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

module.exports.edit = async (req, res) => {
  find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);
    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/edit", {
      titlePage: "Chinh sua tai khoan",
      roles: roles,
      data: data,
    });
  } catch (error) {
    req.flash("error", "Khong ton tai tai khoan nay!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      _id: { $ne: req.params.id },
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      req.flash("error", "Email da ton tai");
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }
    }

    await Account.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Cap nhat thanh cong!");
  } catch (error) {
    req.flash("error", "Cap nhat that bai!");
  }

  let backURL = req.get("referer");
  res.redirect(`${backURL}`);
};

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Account.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  req.flash("success", "Xoa thanh cong nguoi dung");

  let backURL = req.get("referer");
  res.redirect(`${backURL}`);
};
