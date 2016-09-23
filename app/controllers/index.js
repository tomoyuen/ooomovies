var Movie = require('../models/movie'),
    Category = require('../models/category');

//home
exports.index = function(req, res) {
    Category
        .find({})
        .populate({ path: 'movies', options: { limit: 5 } })
        .exec(function(err, categories) {
            if (err) {
                console.log(err);
            }

            res.render('index', {
                title: 'imooc homepage',
                categories: categories
            });
        });
};

// search
exports.search = function(req, res) {
    var catId = req.query.cat,
    	page = parseInt(req.query.p, 10) || 0,
    	q = req.query.q,
    	count = 10,
    	index = page * count;

    if (catId) {
    	Category
	        .find({_id: catId})
	        .populate({
	        	path: 'movies',
	        	select: 'title poster'
	        })
	        .exec(function(err, categories) {
	            if (err) {
	                console.log(err);
	            }

	            var category = categories[0] || {},
	            	movies = category.movies || [],
	            	results = movies.slice(index, index + count);

	            res.render('results', {
	                title: 'imooc results',
	                keyword: category.name,
	                currentPage: page + 1,
	                query: 'cat=' + catId,
	                totalPage: Math.ceil(movies.length / count),
	                movies: results
	            });
	        });
    } else {
    	Movie
    		.find({title: new RegExp(q + '.*', 'i')})
    		.exec(function(err, movies) {
    			if (err) {
    				console.log(err);
    			}

    			var results = movies.slice(index, index + count);

    			res.render('results', {
	                title: 'imooc results',
	                keyword: q,
	                currentPage: page + 1,
	                query: 'q=' + q,
	                totalPage: Math.ceil(movies.length / count),
	                movies: results
	            });
    		});
    }
};
