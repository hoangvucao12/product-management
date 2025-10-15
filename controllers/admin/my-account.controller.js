const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    titlePage: "Thong tin ca nhan",
  });
};
