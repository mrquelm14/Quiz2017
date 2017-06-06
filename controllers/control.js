exports.randomplay = function (req, res, next) {
	
	models.Quiz.findAll()
	.then(function(quizzes){
		
		var played=JSON.parse(req.session.played) || [];
		var score = played.length;	
		var quizzId=Math.round(quizzes.length*Math.random());
		
		while (played.indexOf(quizId)!==(-1)){
			quizId=Math.round(quizzes.length*Math.random());}
		
		return models.Quiz.findById(quizzId);
		
	})
	
	.then(function(quizz) {
	
		req.session.played = JSON.stringify{played.push(quizzId)};
                res.render('quizzes/random_play', {
                quiz: quiz,
                score: req.session.score,
		});
};


// GET /quizzes/random_play
exports.random_play = function (req, res, next) {

    if (!req.session.score) req.session.score = 0;
    if (!req.session.questions) req.session.questions = [-1];

    models.Quiz.count()
    .then(function(count) {

        return models.Quiz.findAll({
            where: { id: { $notIn: req.session.questions } }
        })

    })
    .then(function(quizzes) {
	var quizID = -1;

        if (quizzes.length > 0) {
            var random = parseInt(Math.random() * quizzes.length);
            quizID = quizzes[random].id;
        } else {
            res.render('quizzes/random_nomore', {
                score: req.session.score
            });
        }

        return models.Quiz.findById(quizID);

    })
    .then(function(quiz) {
        if (quiz) {
            req.session.questions.push(quiz.id);
            res.render('quizzes/random_play', {
                quiz: quiz,
                score: req.session.score
            });
        }
    })
    .catch(function(error) {
        req.flash('error', 'Error al cargar el Quiz: ' + error.message);
        next(error);
    });
};
