module.exports.dashboard = (req, res) => {
  res.render("admin/pages/dashboard/index", {
    titlePage: "Trang tong quan",
  });
};
