var Category = require('../models/category'),
  _ = require('underscore');

// category add
exports.add = function(req, res) {
  res.render('category_admin', {
    title: '后台分类录入',
    category: {}
  });
};

// admin update category
exports.update = function(req, res) {
  var id = req.params.id;

  if (id) {
    Category.findById(id, function(err, category) {
      res.render('category_admin', {
        title: 'update category',
        category: category
      });
    });
  }
};

// admin post category
exports.save = function(req, res) {
  var id = req.body.category._id,
    categoryObj = req.body.category,
    _category;

  if (id) {
    Category.findById(id, function(err, category) {
      if (err) {
        console.log(err);
      }

      _category = _.extend(category, categoryObj);
      _category.save(function(err, category) {
        if (err) {
          console.log(err);
        }

        res.redirect('/admin/category/list');
      })
    })
  } else {
    _category = new Category(categoryObj);

    _category.save(function(err, category) {
      if (err) {
        console.log(err);
      }

      res.redirect('/admin/category/list');
    })
  }
};

// category list
exports.list = function(req, res) {
	Category.fetch(function(err, categories) {
		if(err) {
			console.log(err);
		}

		res.render('categorylist', {
			title: 'Category list',
			categories: categories
		});
	});
};

// category find
exports.find = function(req, res) {
  var id = req.params.id,
    page = parseInt(req.query.p, 10) || 0,
    q = req.query.q,
    count = 10,
    index = page * count;

  if (id) {
    Category.find({_id: id})
      .populate({ path: 'movies', select: 'title poster'})
      .exec(function(err, categories) {
        if (err) {
          console.log(err);
        }

        var category = categories[0] || {},
          movies = category.movies || [],
          results = movies.slice(index, index + count);

        res.render('results', {
          title: 'category',
          keyword: category.name,
          currentPage: page + 1,
          params: id,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        });
      });
  }
}
