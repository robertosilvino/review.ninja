// *****************************************************
// Pull List Controller
//
// tmpl: pull/list.html
// path: /:user/:repo/pull/:number
// resolve: open, closed 
// *****************************************************

module.controller('PullListCtrl', ['$scope', '$state', '$stateParams', '$HUB', '$RPC', 'open', 'closed', 'Issue',
    function($scope, $state, $stateParams, $HUB, $RPC, open, closed, Issue) {
        console.log('OPEN');
        console.log(open);
        // get the open issues
        $scope.open = open;

        // get the closed issues
        $scope.closed = closed;

        //check if more open issues are there
        $HUB.call('page','hasNextPage',$scope.open.meta, function(err, res, data) {
            $scope.hasMoreOpen = res.value;
        });

        //check for more closed issues
        $HUB.call('page','hasNextPage', $scope.closed.meta, function(err, res, data) {
            $scope.hasMoreClosed = res.value;
        });

        // obj for createing new issue
        $scope.issue = {};

        // file reference
        $scope.update({ sha: null, ref: null, type: null, disabled: null });

        // parse the comments
        $scope.open.value.forEach(function(issue) {
            issue = Issue.parse(issue);
        });
        $scope.closed.value.forEach(function(issue) {
            issue = Issue.parse(issue);
        });

        // update the comparison view
        $scope.compComm($scope.pull.base.sha);

        //
        // actions
        //

        $scope.moreOpen = function() {

            $HUB.call('page', 'getNextPage', $scope.open.meta, function(err, res, data) {
                
                res.value.forEach(function(issue) {
                    issue = Issue.parse(issue);
                });
                
                $scope.open.value = $scope.open.value.concat(res.value);
                $scope.open.meta = res.meta;

                $HUB.call('page', 'hasNextPage', $scope.open.meta, function(err, res, data) {
                    $scope.hasMoreOpen = res.value;
                });
            });
        };

        $scope.moreClosed = function() {

            $HUB.call('page', 'getNextPage', $scope.closed.meta, function(err, res, data) {

                res.value.forEach(function(issue) {
                    issue = Issue.parse(issue);
                });
                
                $scope.closed.value = $scope.closed.value.concat(res.value);
                $scope.closed.meta = res.meta;

                $HUB.call('page','hasNextPage', $scope.closed.meta, function(err, res, data) {
                    $scope.hasMoreClosed = res.value;
                });
            });
        };

        $scope.create = function() {

            $RPC.call('issue', 'add', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.number,
                repo_uuid: $scope.repo.id,
                title: $scope.issue.title,
                body: $scope.issue.body,
                sha: $scope.pull.head.sha,
                reference: $scope.reference.ref
            }, function(err, issue) {

                // to do: error handling

                if(!err) {
                    $state.go('repo.pull.issue', { issue: issue.value.number });
                }
            });
        };
    }
]);
