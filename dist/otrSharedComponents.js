"use strict";
angular.module('otrSharedComponents', ['otrSharedComponents.tpls', 'courtsDropdown']);

"use strict";
function fuseHighlightDirective() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var result = scope.result;
            var fullString = attrs.fuseHighlightBind;
            var matchKey = attrs.fuseHighlightKey;
            var isBestMatch = attrs.fuseHighlightBestMatch;
            var htmlString = '';
            var sliceStartingIndex = 0;
            var matches = _
                .chain(result)
                .get('originalObject.matches', [])
                // @ts-ignore
                .filter(function (match) { return !matchKey || match.key === matchKey; })
                .map('indices')
                .flatten()
                .value();
            var longestMatch = _
                .chain(matches)
                // @ts-ignore
                .map(function (match) { return 1 + _.last(match) - _.first(match); })
                .max()
                .value();
            for (var i = 0; i < matches.length; i++) {
                var matchStart = _.first(matches[i]) || 0;
                // @ts-ignore
                var matchEnd = 1 + _.last(matches[i]);
                var matchLength = matchEnd - matchStart;
                if (matchStart >= sliceStartingIndex) {
                    htmlString += fullString.slice(sliceStartingIndex, matchStart);
                    // Only highlight the upper half of the stretches of matches
                    if ((!isBestMatch && matchLength > longestMatch / 2)
                        || (isBestMatch && matchLength === longestMatch)) {
                        htmlString += '<span class="highlight">' + fullString.slice(matchStart, matchEnd) + '</span>';
                    }
                    else {
                        htmlString += fullString.slice(matchStart, matchEnd);
                    }
                    sliceStartingIndex = matchEnd;
                }
            }
            htmlString += fullString.slice(sliceStartingIndex);
            element.html(htmlString);
        }
    };
}
angular
    .module('otrSharedComponents')
    .directive('otrFuseHighlight', fuseHighlightDirective);

"use strict";
var ctrl = null;
var CourtsDropdownComponent = /** @class */ (function () {
    function CourtsDropdownComponent() {
        this.bindings = {
            onSelectCourt: '&',
            inputClass: '@',
            hasError: '<',
            courts: '<'
        };
        this.controller = CourtsDropdownCtrl;
        this.controllerAs = 'vm';
        this.templateUrl = '/components/courts-dropdown/courts-dropdown.component.html';
    }
    return CourtsDropdownComponent;
}());
var CourtsDropdownCtrl = /** @class */ (function () {
    function CourtsDropdownCtrl() {
        this.inputClass = '';
        this.hasError = false;
        this.classes = this.inputClass;
        this.isCourtsLoading = false;
    }
    CourtsDropdownCtrl.prototype.$onInit = function () {
        ctrl = this;
    };
    CourtsDropdownCtrl.prototype.$onChanges = function (changes) {
        if (changes.hasError) {
            this.classes = this.inputClass + (this.hasError
                ? " has-error"
                : "");
        }
        if (changes.courts && this.courts) {
            this.initFuse(angular.copy(this.courts));
        }
    };
    CourtsDropdownCtrl.prototype.initFuse = function (courts) {
        var fuseAllKeysOptions = {
            includeMatches: true,
            includeScore: true,
            distance: 2000,
            threshold: 0.5,
            keys: ['customTitle', 'customDescription']
        };
        try {
            this.fuseAllKeys = new Fuse(courts, fuseAllKeysOptions);
        }
        catch (_a) {
            throw "Dependency fuse.js required";
        }
        var fuseCourtCodeOptions = {
            includeMatches: true,
            includeScore: true,
            distance: 10,
            threshold: 0.1,
            keys: ['courtCode']
        };
        try {
            this.fuseCourtCode = new Fuse(courts, fuseCourtCodeOptions);
        }
        catch (_b) {
            throw "Dependency fuse.js required";
        }
    };
    CourtsDropdownCtrl.prototype.findMatchingCourts = function (query) {
        var threshold = 600;
        var allKeysResults = _.sortBy(ctrl.fuseAllKeys.search(query), 'courtId');
        var courtCodeResults = _.sortBy(ctrl.fuseCourtCode.search(query), 'courtId');
        var results = _
            .chain(allKeysResults)
            .unionWith(courtCodeResults, function (codeVal, allVal) {
            var isEqual = codeVal.item.courtId === allVal.item.courtId;
            if (isEqual) {
                allVal.score = _.min([codeVal.score, allVal.score]);
            }
            return isEqual;
        })
            .sortBy('score')
            .take(threshold)
            .map(function (result) {
            result.item.matches = result.matches;
            return result.item;
        })
            .value();
        return results;
    };
    CourtsDropdownCtrl.$inject = [];
    return CourtsDropdownCtrl;
}());
angular
    .module('courtsDropdown', [])
    .component('courtsDropdown', new CourtsDropdownComponent());
