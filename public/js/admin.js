$(function() {
    $('.del').on('click', function(e) {
        var target = $(e.target),
            id = target.data('id'),
            tr = $('.item-id-' + id)

        $.ajax({
            type: 'DELETE',
            url: '/admin/list?id=' + id
        }).done(function(results) {
            if(results.success === 1) {
                if (tr.length > 0) {
                    tr.remove()
                }
            }
        })
    })

    $('#douban').on('blur', function() {
    	var target = $(this),
    		id = target.val()

    	if (id) {
	    	$.ajax({
	    		url: 'https://api.douban.com/v2/movie/subject/' + target.val(),
	    		cache: true,
	    		type: 'get',
	    		dataType: 'jsonp',
	    		crossDomain: true,
	    		jsonp: 'callback',
	    		success: function(data) {
	    			$('#inputTitle').val(data.title)
					$('#inputDirector').val(data.directors[0].name)
					$('#inputNation').val(data.countries[0])
					$('#inputPoster').val(data.images.large)
					$('#inputYear').val(data.year)
					$('#inputSummary').val(data.summary)
	    		}
	    	})
    	}

    })
})
