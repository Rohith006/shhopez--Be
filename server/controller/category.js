const Category = require("../models/category")
const SubCategory = require("../models/subCategory")

const slugify = require("slugify")

exports.create = async (req, res) => {
    try {
        const {name} = req.body
        // console.log("category>>>>", name)
        res.json(await new Category({ name, slug: slugify(name)}).save())
        
    } catch (error) {
        res.status(400).send("Create category failed");
    }

}

exports.list = async (req, res) => {
    res.json( await Category.find({}).sort({ createdAt: -1}).exec())
}

exports.read = async (req, res) => {
    let category = await Category.findOne({ slug: req.params.slug}).exec()
    res.json(category)
}

exports.update = async (req, res) => {
    const { name } = req.body
    try {
        const updated = await Category.findOneAndUpdate(
            { slug: req.params.slug }, 
            { name, slug: slugify(name) },
            { new: true })
        res.send(updated)
    } catch (error) {
        res.status(400).send("Update category operation failed")
    }
}

exports.remove = async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({slug: req.params.slug})
        console.log("delete>>>>>>", deleted)

        res.json(deleted)
    } catch (error) {
        res.status(400).send("delete category operation failed")
    }
}

exports.getSubCategories  =  (req, res) => {
    SubCategory.find({ parent: req.params._id }).exec((err, subcategories) => {
        if (err) console.log(err);
        res.json(subcategories);
    });
}


