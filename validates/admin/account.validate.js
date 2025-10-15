module.exports.createPost = (req, res, next) => {
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

  if (!req.body.phone) {
    req.flash("error", "Vui long nhap so dien thoai!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  next();
};

module.exports.editPatch = (req, res, next) => {
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

  if (!req.body.phone) {
    req.flash("error", "Vui long nhap so dien thoai!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  next();
};
