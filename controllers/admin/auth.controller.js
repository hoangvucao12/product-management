const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

module.exports.login = (req, res) => {
  if (req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login", {
      titlePage: "Trang dang nhap",
    });
  }
};

module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await Account.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email khong ton tai!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", "Sai mat khau!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", "Tai khoan da bi khoa!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  res.cookie("token", user.token);

  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
