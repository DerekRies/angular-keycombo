'use strict';

angular.module('keycombo', [] )
  .directive('keyCombo', [function () {

    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, ngModel) {
        // TODO: Capture mac cmd/win keys between browsers
        var keyCombo = 'ctrl+a',
        keyMapping = {
          16: 'shift',
          17: 'ctrl',
          18: 'alt',
          32: 'space',
          91: 'win'
        },
        keysDown = {};

        function sortByLength (a,b) {
          if(a.length > b.length) {
            return -1;
          }
          else {
            return 1;
          }
        }

        function getKeysDown () {
          var keyComboSequence = [];
          for(var downKey in keysDown) {
            if(downKey in keyMapping) {
              keyComboSequence.push(keyMapping[downKey]);
            }
            else {
              keyComboSequence.push(String.fromCharCode(downKey));
            }
          }
          return keyComboSequence;
        }

        function makeStringFromKeysDown () {
          return getKeysDown().sort(sortByLength).join('+');
        }


        function updateModel (newVal) {
          if(ngModel){
            ngModel.$setViewValue(newVal);
          }
        }

        element.bind('keydown', function (e) {
          if(!(e.keyCode in keyMapping)) {
            element.val('');
          }
          keysDown[e.keyCode] = true;
        });

        element.bind('keyup', function (e) {
          if(!(e.keyCode in keyMapping)) {
            keyCombo = makeStringFromKeysDown();
            updateModel(keyCombo);
            element.val(keyCombo);
          }
          delete keysDown[e.keyCode];
        });
      }
    };

  }]);