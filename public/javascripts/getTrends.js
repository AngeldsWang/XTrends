angular.module('XTrends',[])
  .controller('MainCtrl', function ($scope, $http) {
    $scope.country = "";
    $scope.error = 0;
    $scope.detected = false;
    $scope.currTrend = false;
    $scope.currTrendName = "";
    $scope.searched = false;
    $scope.currTrendsLength = 0;
    $scope.searchedCountry = "";
    $scope.searchCountryOK = false;
    $scope.getTrends = function(country, isFromSearch) {
      $scope.resetError();
      isFromSearch = (typeof isFromSearch === "undefined") ? false : isFromSearch;
      $scope.country = country;
      $scope.woeid = 0;
      if ($scope.woeid === 0) {
        $http.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.placefinder%20where%20text=%22'+$scope.country+'%22&format=json')
          .success(function(data) {
              $scope.woeid = data.query.results.Result.woeid;
              woeid = $scope.woeid;
              $http.get('/trends/' + woeid)
                  .success(function(data, status, headers, config) {
                    if (data.status) {
                      if (isFromSearch) {
                        $scope.searchCountryOK = true;
                        // console.log($scope.searchCountryOK);
                      } else {
                        $scope.detected = true;
                      }
                      $scope.trends = data.trends[0].trends;
                      // console.log($scope.trends);
                    } else {
                      $scope.error = 1;
                      $scope.errorMsg = "Can't find trends around the country " + $scope.country + ". Try another search.";
                    }
                  });
            });
      }
    };

    $scope.searchCountry = function() {
      if ($scope.searchedCountry.length > 0) {
        $scope.getTrends($scope.searchedCountry, true);
      }
    }

    $scope.resetError = function() {
      $scope.error = 0;
      $scope.errorMsg = "";
    }

    $scope.getTweets = function(trend) {
      $scope.resetError();
      $scope.currTrend = true;
      $scope.currTrendName = trend;
      // console.log(trend);
      if (trend[0] === '#') {
        trend = trend.slice(1);
      }
      $http.get('/trendinfo/' + trend).success(function(data, status, headers, config) {
        if (data.status) {
          $scope.searched = true;
          $scope.trendinfo = data.trendinfo;
          $scope.currTrendsLength = $scope.trendinfo.length;
        } else {
          $scope.error = 2;
          $scope.errorMsg =  "Can't find any tweets about this trends. Try later."
        }
      })
    };
})
.directive('repeatBrick', function() {
  return function(scope, element, attrs) {
    if (scope.$last){
      scope.$emit('LastBrick');
    }
  }
})
.directive('theFreewall', function() {
  return function(scope, element, attrs) {
    scope.$on('LastBrick', function(event){
      var wall = new freewall("#freewall");
      wall.reset({
        selector: '.brick',
        animate: true,
        cellW: 200,
        cellH: 'auto',
        onResize: function() {
          wall.fitWidth();
        }
      });
      wall.container.find('.brick img').load(function() {
        wall.fitWidth();
      });
    });
  };
});


