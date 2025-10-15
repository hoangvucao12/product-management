const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/my-account.controller");
const controllerAccount = require("../../controllers/admin/account.controller");

router.get("/", controller.index);
router.get("/edit/:id", controllerAccount.edit);
router.patch("edit/:id", controllerAccount.editPatch);

module.exports = router;
