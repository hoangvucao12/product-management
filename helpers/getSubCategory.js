const Category = require("../models/product-category.model");

module.exports.getCategory = async (parentId) => {
  const getSubCategory = async (parentId) => {
    const subs = await Category.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });

    let allSub = [...subs];

    for (const sub of subs) {
      const children = await getSubCategory(sub.id);
      allSub = allSub.concat(children);
    }

    return allSub;
  };

  return await getSubCategory(parentId);
};
