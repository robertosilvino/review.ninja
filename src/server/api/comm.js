// module
var github = require("../services/github");
// models
var Comm = require('mongoose').model('Comm');

module.exports = {

	get: function(req, done) {

		// var repoUUID = req.args.uuid;
		// var repoName = req.args.repo;
		// var userName = req.args.user;
		// var commUUID = req.args.comm;

		var uuid = req.args.uuid;
		var user = req.args.user;
		var repo = req.args.repo;
		var comm = req.args.comm;

		Comm.with({repo: uuid, uuid: comm}, function(err, obj) {

			if(obj) {
				return done(null, obj);
			}

			else {

				github({obj: "repos", fun: "getContent", arg: {
					user: user,
					repo: repo,
					ref: comm,
					path: ".ninja.json"
				}, token: req.user.token}, function(err, obj) {
					
					var content;

					try {
						content = new Buffer(obj.content, 'base64').toString();
					} catch(ex) {
						content = null;
					}

					Comm.with({repo: uuid, uuid: comm}, {repo: uuid, uuid: comm, ninja: content}, function(err, obj) {
						return done(null, obj);
					});

				});

			}

		});

	},

	file: function(req, done) {

		var user = req.args.user;
		var repo = req.args.repo;
		var sha = req.args.sha;

		github({
			obj: 'gitdata',
			fun: 'getBlob',
			arg: {
				user: user,
				repo: repo,
				sha: sha
			},
			token: req.user.token
		}, function(err, obj) {

			var json;

			try {
				switch(obj.encoding) {
					case 'base64':
						json = (new Buffer(obj.content, 'base64')).toString();
						break;
					default:
						json = '';
						break;
				}
			} catch(ex) {
				json = '';
			}

			done(null, {
				content: json
			});

		});

	}
};