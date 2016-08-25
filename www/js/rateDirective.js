// http://angulartutorial.blogspot.com/2014/03/rating-stars-in-angular-js-using.html

(function() {
  'use strict';

  angular
    .module('cervejeiro')
    .directive('starRating', starRating);

  function starRating() {
    return {
      restrict: 'EA',
      template:
        '<ul class="star-rating">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="icon ion-star favorite"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '=?',
        readonly: '=?',
        object: '=?'
      },
      link: function(scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        } 
        if (scope.ratingValue == undefined) {
          scope.ratingValue = -1;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function(index) {
          if (scope.readonly == undefined || scope.readonly === false){
            scope.ratingValue = index + 1;
            scope.object.stars = scope.ratingValue;
            scope.onRatingSelect(scope.object);
          }
        };
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (oldValue == undefined) {
            scope.ratingValue = 0;
          }
          if (newValue) {
            updateStars();
          }
        });
      }
    };
  }
})();
