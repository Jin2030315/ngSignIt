angular.module('MyDirectives',[])
.directive('sigpad', function($timeout){
  return {
    templateUrl: 'views/sigPad.html',
    restrict: 'E',
    scope : true,
    require: 'ngModel',
    link: function (scope,element,attr,ctrl) {
      var sigPadAPI = $(element).signaturePad({
                                  drawOnly:true,
                                  lineColour: '#FFF'
                                });
      
      $(attr.clearbtn).on('click',function (e) {
        sigPadAPI.clearCanvas();
      });
      
      scope.updateModel = function() {
        $timeout(function() {
          ctrl.$setViewValue(sigPadAPI.getSignature());
        });
      };      
      
      ctrl.$render = function() {
        if ( ctrl.$viewValue ) {
          sigPadAPI.regenerate(ctrl.$viewValue);
        } else {
          sigPadAPI.clearCanvas();
        }
      };
      
      // Validate signature pad.
      ctrl.$parsers.unshift(function(viewValue) {
        console.log('validating', viewValue);
        if ( sigPadAPI.validateForm() ) {
          // it is valid
          ctrl.$setValidity('sigpad', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('sigpad', false);
          return undefined;
        }
      });      
      
    }
  };
})
.directive('regensigpad',function() {
  return {
    template: '<div class="sig sigWrapper"><canvas class="pad" width="436" height="120"></canvas></div>',
    restrict: 'E',
    scope: true,
    link: function (scope,element,attr,ctrl) {
      var sigPadAPI = $(element).signaturePad({
        displayOnly: true
      }).regenerate(scope.$eval(attr.sigdata));      
    }

  };
});