module.directive('diff', function() {
	return {
		restrict: 'E',
		templateUrl: '/directives/templates/diff.html',
		scope: {
			content: '='
		},
		link: function(scope, elem, attrs) {

			scope.$watch('content', function(newVal, oldVal) {
				if(newVal) {

					var lines = scope.content.trim().replace(/\t/g, '    ').split('\n');

					var base = 0;
					var head = 0;

					scope.lines = [];

					for(var i=0; i<lines.length; i++) {

						var line = lines[i].substring(1, lines[i].length) || ' ';

						switch( lines[i][0] ) {
							case '@':

								var meta = lines[i].match(/@@(.*?)@@/g)[0];

								var line = lines[i].substring(meta.length+1, lines[i].length) || ' ';

								var range = meta.substring(3, meta.length-3);

								var baseRange = range.split(' ')[0];
								var headRange = range.split(' ')[1];

								baseRange = baseRange.substring(1, baseRange.length);
								headRange = headRange.substring(1, headRange.length);

								base = parseInt(baseRange.split(',')[0]);
								head = parseInt(headRange.split(',')[0]);

								scope.lines.push({
									type: 'meta',
									line: meta
								});

								scope.lines.push({
									line: line,
									head: head++,
									base: base++
								});

								break;
							case '+':
								scope.lines.push({
									type: 'addition',
									line: line,
									head: head++,
									base: null
								});
								break;
							case '-':
								scope.lines.push({
									type: 'deletion',
									line: line,
									head: null,
									base: base++
								});
								break;
							case '\\':
								break;
							default:
								scope.lines.push({
									line: line,
									head: head++,
									base: base++
								});
								break;
						}
					}
				}
			});
		}
	}
});