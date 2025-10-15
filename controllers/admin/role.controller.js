const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/role/index", {
    titlePage: "Nhom quyen",
    records: records,
  });
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/role/create", {
    titlePage: "Them nhom quyen",
  });
};

module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/role`);
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };
    const data = await Role.findOne(find);

    res.render("admin/pages/role/edit", {
      titlePage: "Sua nhom quyen",
      data: data,
    });
  } catch (error) {
    req.flash("error", "Khong ton tai nhom quyen nay!");
    res.redirect(`${systemConfig.prefixAdmin}/role`);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    await Role.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Cap nhat thanh cong!");
  } catch (error) {
    req.flash("error", "Cap nhat that bai!");
  }

  let backURL = req.get("referer");
  res.redirect(`${backURL}`);
};

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Role.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
  req.flash("success", "Xoa thanh cong nhom quyen");

  let backURL = req.get("referer");
  res.redirect(`${backURL}`);
};

module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/role/permission", {
    titlePage: "Phan quyen",
    records: records,
  });
};

module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);

    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }

    req.flash("success", "Cap nhat thanh cong!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
  } catch (error) {
    req.flash("error", "Cap nhat that bai!");
  }
};
