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
