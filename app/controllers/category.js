var Category = require('../models/category')

//category add
exports.add = function(req, res) {
    res.render('category_admin', {
        title: '后台分类录入',
        category: {}
    })
}

// admin post category
exports.save = function(req, res) {
    var _category = req.body.category,
        category = new Category(_category)

    category.save(function(err, category) {
        if (err) {
            console.log(err)
        }

        res.redirect('/admin/category/list')
    })
}

// category list
exports.list = function(req, res) {
	Category.fetch(function(err, categories) {
		if(err) {
			console.log(err)
		}

		res.render('categorylist', {
			title: 'Category list',
			categories: categories
		})
	})
}

