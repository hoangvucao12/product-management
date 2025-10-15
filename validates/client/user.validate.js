module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui long nhap ho ten!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  if (!req.body.email) {
    req.flash("error", "Vui long nhap email!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  if (!req.body.password) {
    req.flash("error", "Vui long nhap mat khau!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  next();
};

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui long nhap email!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  if (!req.body.password) {
    req.flash("error", "Vui long nhap mat khau!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  next();
};

module.exports.forgotPassword = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui long nhap email!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }
  next();
};

module.exports.resetPassword = (req, res, next) => {
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  if (!req.body.confirmPassword) {
    req.flash("error", "Vui lòng xác nhận mật khẩu!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  if (req.body.password != req.body.confirmPassword) {
    req.flash("error", "Mật khẩu không khớp!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  next();
};
