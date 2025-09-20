module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Vui long nhap tieu de!");
    let backURL = req.get("referer");
    res.redirect(`${backURL}`);
    return;
  }

  next();
};
