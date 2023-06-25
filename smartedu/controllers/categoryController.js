const Category = require("../Models/Category");


exports.createCategory = async (req, res) => {
    try {
      const category = await Category.create(req.body);
  
      res.status(201).redirect("/users/dashboard");
    } catch (error) {
      res.status(400).json({
        status: "warning",
        error,
      });
    }
  };

  exports.deleteCategory = async (req, res) => {
    try {
      await Category.findByIdAndRemove({ _id: req.params.id });
      //await Course.deleteMany({ user: req.params.id });
      res.status(200).redirect("/users/dashboard");
    } catch (error) {
      req.flash("400", "Bir şeyler yanlış gitti  ???");
    }
  };
  