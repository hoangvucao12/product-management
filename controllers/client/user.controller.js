const User = require("../../models/user.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMaiHelper = require("../../helpers/sendMail");
const Cart = require("../../models/cart.model");

module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    titlePage: "Đăng ký tài khoản",
  });
};

module.exports.registerPost = async (req, res) => {
  const exitEmail = await User.findOne({
    email: req.body.email,
  });

  if (exitEmail) {
    req.flash("error", "Email đã tồn tại!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};

module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    titlePage: "Đăng nhập tài khoản",
  });
};

module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  if (md5(password) !== user.password) {
    req.flash("error", "Sai mật khẩu!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  if (user.status === "inactive") {
    req.flash("error", "Tài khoản đang bị khóa!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  const cartUser = await Cart.findOne({
    user_id: user.id,
  });

  if (cartUser) {
    res.cookie("cartId", cartUser.id);
  } else {
    await Cart.updateOne(
      {
        _id: req.cookies.cartId,
      },
      {
        user_id: user.id,
      }
    );
  }

  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};

module.exports.logout = (req, res) => {
  res.clearCookie("cartId");
  res.clearCookie("tokenUser");
  let backURL = req.get("referer");
  res.redirect(`${backURL}`);
};

module.exports.passwordForgot = (req, res) => {
  res.render("client/pages/user/forgot-password", {
    titlePage: "Lấy lại mật khẩu",
  });
};

module.exports.passwordForgotPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  const otp = generateHelper.generateRandomNumber(8);

  const objectForgotPassword = {
    email: email,
    otp: otp,
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 1 phút.`;
  sendMaiHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};

module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    titlePage: "Nhập mã OTP",
    email: email,
  });
};

module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", "OTP không hợp lệ!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    titlePage: "Đổi mật khẩu",
  });
};

module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );

  res.redirect("/");
};

module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    titlePage: "Thông tin tài khoản",
  });
};
