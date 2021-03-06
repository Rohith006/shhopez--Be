const express = require('express')
const router = express.Router()


// middlewares
const {authCheck, adminCheck} = require("../middleware/auth")

//  controllers
const {create, read, update, remove, list, getSubCategories } = require("../controller/category")


// routes
router.post("/category", authCheck, adminCheck, create);
router.get("/categories", list);
router.get("/category/:slug", read);
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);

router.get("/category/subs/:_id", getSubCategories);


module.exports = router


// http://localhost:9000/api/category/subs/6051e3e41b4fb54f40f564a2