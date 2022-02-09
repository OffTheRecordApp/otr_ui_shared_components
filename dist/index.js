"use strict";
angular.module('otr-ui-shared-components', ['angucomplete-alt', 'otrBackendService', 'otr-ui-shared-components.tpls']);

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
    .module('otr-ui-shared-components')
    .directive('otrFuseHighlight', fuseHighlightDirective);

"use strict";
var OtrServiceProvider = /** @class */ (function () {
    function OtrServiceProvider() {
        var _this = this;
        this.$get = [
            'OtrService',
            function (OtrService) {
                if (!_this._otrServiceInstance) {
                    var options = { domain: _this._domain };
                    if (!_this._domain) {
                        var message = 'Domain has not been set in app config';
                        console.error(message);
                        throw message;
                    }
                    if (_this._cache) {
                        options.cache = _this._cache;
                    }
                    if (_this._token) {
                        options.token = _this._token;
                    }
                    _this._otrServiceInstance = new OtrService(options);
                }
                return _this._otrServiceInstance;
            }
        ];
        return;
    }
    OtrServiceProvider.prototype.setDomain = function (domain) {
        this._domain = domain;
    };
    OtrServiceProvider.prototype.setCache = function (cache) {
        this._cache = cache;
    };
    OtrServiceProvider.prototype.setToken = function (token) {
        this._token = token;
    };
    return OtrServiceProvider;
}());
angular.module('otr-ui-shared-components').provider('otrService', OtrServiceProvider);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CourtsDropdownCtrl = /** @class */ (function () {
    function CourtsDropdownCtrl($scope, otrService) {
        this.$scope = $scope;
        this.otrService = otrService;
        this.inputClass = '';
        this.hasError = false;
        this.classes = this.inputClass;
        this.isDataLoading = false;
        this.findMatchingCourts = this.findMatchingCourts.bind(this);
    }
    CourtsDropdownCtrl.prototype.$onInit = function () { };
    CourtsDropdownCtrl.prototype.$onChanges = function (changes) {
        var _this = this;
        if (changes.hasError) {
            this.classes = this.inputClass + (this.hasError
                ? " has-error"
                : "");
        }
        if (changes.state && this.state) {
            this.fetchCourts()
                .then(function (courts) { return _this.initFuse(angular.copy(courts)); });
        }
    };
    CourtsDropdownCtrl.prototype.fetchCourts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 3]);
                        this.isDataLoading = true;
                        return [4 /*yield*/, this.otrService.findCourtsUsingGET({ state: this.state })];
                    case 1:
                        response = _a.sent();
                        this.courts = _.forEach(response.data.courts, function (court) {
                            court.customTitle = court.courtName;
                            court.customTitle += court.courtNameAdditional
                                ? ' – ' + court.courtNameAdditional
                                : '';
                            court.customTitle += court.courtCode
                                ? ' (' + court.courtCode + ')'
                                : '';
                            court.customDescription = court.address.city + ', '
                                + court.address.regionCode + ' '
                                + court.address.postalCode + ' – '
                                + court.address.countyName + ' County';
                        });
                        return [2 /*return*/, this.courts];
                    case 2:
                        this.isDataLoading = false;
                        this.$scope.$apply();
                        return [7 /*endfinally*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
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
        var allKeysResults = _.sortBy(this.fuseAllKeys.search(query), 'courtId');
        var courtCodeResults = _.sortBy(this.fuseCourtCode.search(query), 'courtId');
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
    return CourtsDropdownCtrl;
}());
angular
    .module('otr-ui-shared-components')
    .component('appCourtsDropdown', {
    controller: CourtsDropdownCtrl,
    controllerAs: 'vm',
    templateUrl: 'app/components/courts-dropdown/courts-dropdown.component.html',
    bindings: {
        onSelectCourt: '&',
        inputClass: '@',
        hasError: '<',
        state: '@'
    }
});
CourtsDropdownCtrl.$inject = ['$scope', 'otrService'];

angular.module('otr-ui-shared-components.tpls', []).run(['$templateCache', function($templateCache) {$templateCache.put('/otr-search-template.html','<div class="angucomplete-holder"\n     ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">\n\n     <span>\n        <input ng-model="searchStr"\n               ng-disabled="disableInput"\n               type="text"\n               placeholder="{{placeholder}}"\n               ng-focus="onFocusHandler()"\n               class="{{inputClass}}"\n               ng-blur="hideResults($event)"\n               autocapitalize="off"\n               autocorrect="off"\n               autocomplete="off"\n               ng-change="inputChangeHandler(searchStr)"/>\n          <span ng-if="$parent.vm.isDataLoading">\n            <i style="position: relative; top: 1px; right: 35px;" class="fa fa-pulse fa-spinner"></i>\n          </span>\n     </span>\n\n    <div class="angucomplete-dropdown otr-angucomplete-dropdown"\n       ng-show="showDropdown">\n      <div class="angucomplete-searching"\n           ng-show="searching"\n           ng-bind="textSearching">\n      </div>\n      <div class="angucomplete-searching"\n           ng-show="!searching && (!results || results.length == 0)"\n           ng-bind="textNoResults">\n      </div>\n\n      <div class="otr-angucomplete-row angucomplete-row"\n         ng-repeat="result in results"\n         ng-click="(selectResult(result))"\n         ng-mouseenter="hoverRow($index)"\n         ng-class="{\'otr-angucomplete-selected-row\': $index == currentIndex}">\n\n        <div class="angucomplete-title"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.title}}"\n             fuse-highlight-key="customTitle">\n        </div>\n        <div class="angucomplete-description"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.description}}"\n             fuse-highlight-key="customDescription">\n        </div>\n      </div>\n    </div>\n</div>');
$templateCache.put('/components/courts-dropdown/courts-dropdown.component.html','<div class="otr-dropdown" ng-switch="vm.isDataLoading">\n    <span class="otr-dropdown__icon"\n          ng-switch-when="true">\n        <i class="fa fa-spinner fa-pulse"></i>\n    </span>\n    <span class="otr-dropdown__icon"\n          ng-switch-default>\n        <i class="fa fa-angle-down"></i>\n    </span>2\n\n    <angucomplete-alt\n        template-url="/otr-search-template.html"\n        id="courts-search-bar"\n        placeholder="e.g. Seattle Municipal Court"\n        pause="200"\n        selected-object="vm.onSelectCourt()"\n        local-data="vm.courts"\n        local-search="vm.findMatchingCourts"\n        title-field="customTitle"\n        description-field="customDescription"\n        minlength="0"\n        auto-match="true"\n        text-no-results="Enter the court name, city, county, address, or zip code."\n        text-searching="Searching courts..."\n        input-class="{{vm.classes}}"\n        disable-input="vm.isDataLoading"\n        clear-selected="true"\n        ng-keydown="vm.isCourtFormSubmitted = false"\n    />\n</div>');}]);
"use strict";
angular.module('otr-ui-shared-components', ['angucomplete-alt', 'otrBackendService', 'otr-ui-shared-components.tpls']);

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
    .module('otr-ui-shared-components')
    .directive('otrFuseHighlight', fuseHighlightDirective);

"use strict";
var OtrServiceProvider = /** @class */ (function () {
    function OtrServiceProvider() {
        var _this = this;
        this.$get = [
            'OtrService',
            function (OtrService) {
                if (!_this._otrServiceInstance) {
                    var options = { domain: _this._domain };
                    if (!_this._domain) {
                        var message = 'Domain has not been set in app config';
                        console.error(message);
                        throw message;
                    }
                    if (_this._cache) {
                        options.cache = _this._cache;
                    }
                    if (_this._token) {
                        options.token = _this._token;
                    }
                    _this._otrServiceInstance = new OtrService(options);
                }
                return _this._otrServiceInstance;
            }
        ];
        return;
    }
    OtrServiceProvider.prototype.setDomain = function (domain) {
        this._domain = domain;
    };
    OtrServiceProvider.prototype.setCache = function (cache) {
        this._cache = cache;
    };
    OtrServiceProvider.prototype.setToken = function (token) {
        this._token = token;
    };
    return OtrServiceProvider;
}());
angular.module('otr-ui-shared-components').provider('otrService', OtrServiceProvider);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CourtsDropdownCtrl = /** @class */ (function () {
    function CourtsDropdownCtrl($scope, otrService) {
        this.$scope = $scope;
        this.otrService = otrService;
        this.inputClass = '';
        this.hasError = false;
        this.classes = this.inputClass;
        this.isDataLoading = false;
        this.findMatchingCourts = this.findMatchingCourts.bind(this);
    }
    CourtsDropdownCtrl.prototype.$onInit = function () { };
    CourtsDropdownCtrl.prototype.$onChanges = function (changes) {
        var _this = this;
        if (changes.hasError) {
            this.classes = this.inputClass + (this.hasError
                ? " has-error"
                : "");
        }
        if (changes.state && this.state) {
            this.fetchCourts()
                .then(function (courts) { return _this.initFuse(angular.copy(courts)); });
        }
    };
    CourtsDropdownCtrl.prototype.fetchCourts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 3]);
                        this.isDataLoading = true;
                        return [4 /*yield*/, this.otrService.findCourtsUsingGET({ state: this.state })];
                    case 1:
                        response = _a.sent();
                        this.courts = _.forEach(response.data.courts, function (court) {
                            court.customTitle = court.courtName;
                            court.customTitle += court.courtNameAdditional
                                ? ' – ' + court.courtNameAdditional
                                : '';
                            court.customTitle += court.courtCode
                                ? ' (' + court.courtCode + ')'
                                : '';
                            court.customDescription = court.address.city + ', '
                                + court.address.regionCode + ' '
                                + court.address.postalCode + ' – '
                                + court.address.countyName + ' County';
                        });
                        return [2 /*return*/, this.courts];
                    case 2:
                        this.isDataLoading = false;
                        this.$scope.$apply();
                        return [7 /*endfinally*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
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
        var allKeysResults = _.sortBy(this.fuseAllKeys.search(query), 'courtId');
        var courtCodeResults = _.sortBy(this.fuseCourtCode.search(query), 'courtId');
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
    return CourtsDropdownCtrl;
}());
angular
    .module('otr-ui-shared-components')
    .component('appCourtsDropdown', {
    controller: CourtsDropdownCtrl,
    controllerAs: 'vm',
    templateUrl: 'app/components/courts-dropdown/courts-dropdown.component.html',
    bindings: {
        onSelectCourt: '&',
        inputClass: '@',
        hasError: '<',
        state: '@'
    }
});
CourtsDropdownCtrl.$inject = ['$scope', 'otrService'];

angular.module('otr-ui-shared-components.tpls', []).run(['$templateCache', function($templateCache) {$templateCache.put('/otr-search-template.html','<div class="angucomplete-holder"\n     ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">\n\n     <span>\n        <input ng-model="searchStr"\n               ng-disabled="disableInput"\n               type="text"\n               placeholder="{{placeholder}}"\n               ng-focus="onFocusHandler()"\n               class="{{inputClass}}"\n               ng-blur="hideResults($event)"\n               autocapitalize="off"\n               autocorrect="off"\n               autocomplete="off"\n               ng-change="inputChangeHandler(searchStr)"/>\n          <span ng-switch="$parent.vm.isDataLoading">\n              <span ng-switch-when="true">\n                  <i style="position: relative; top: 1px; right: 35px;" class="fa fa-pulse fa-spinner"></i>\n              </span>\n              <span ng-switch-default>\n                  <i style="position: relative; top: 1px; right: 35px;" class="fa fa-pulse fa-spinner"></i>\n              </span>\n          </span>\n     </span>\n\n    <div class="angucomplete-dropdown otr-angucomplete-dropdown"\n       ng-show="showDropdown">\n      <div class="angucomplete-searching"\n           ng-show="searching"\n           ng-bind="textSearching">\n      </div>\n      <div class="angucomplete-searching"\n           ng-show="!searching && (!results || results.length == 0)"\n           ng-bind="textNoResults">\n      </div>\n\n      <div class="otr-angucomplete-row angucomplete-row"\n         ng-repeat="result in results"\n         ng-click="(selectResult(result))"\n         ng-mouseenter="hoverRow($index)"\n         ng-class="{\'otr-angucomplete-selected-row\': $index == currentIndex}">\n\n        <div class="angucomplete-title"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.title}}"\n             fuse-highlight-key="customTitle">\n        </div>\n        <div class="angucomplete-description"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.description}}"\n             fuse-highlight-key="customDescription">\n        </div>\n      </div>\n    </div>\n</div>');
$templateCache.put('/components/courts-dropdown/courts-dropdown.component.html','<div class="otr-dropdown">\n    <angucomplete-alt\n        template-url="/otr-search-template.html"\n        id="courts-search-bar"\n        placeholder="e.g. Seattle Municipal Court"\n        pause="200"\n        selected-object="vm.onSelectCourt()"\n        local-data="vm.courts"\n        local-search="vm.findMatchingCourts"\n        title-field="customTitle"\n        description-field="customDescription"\n        minlength="0"\n        auto-match="true"\n        text-no-results="Enter the court name, city, county, address, or zip code."\n        text-searching="Searching courts..."\n        input-class="{{vm.classes}}"\n        disable-input="vm.isDataLoading"\n        clear-selected="true"\n        ng-keydown="vm.isCourtFormSubmitted = false"\n    />\n</div>');}]);
"use strict";
angular.module('otr-ui-shared-components', ['angucomplete-alt', 'otrBackendService', 'otr-ui-shared-components.tpls']);

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
    .module('otr-ui-shared-components')
    .directive('otrFuseHighlight', fuseHighlightDirective);

"use strict";
var OtrServiceProvider = /** @class */ (function () {
    function OtrServiceProvider() {
        var _this = this;
        this.$get = [
            'OtrService',
            function (OtrService) {
                if (!_this._otrServiceInstance) {
                    var options = { domain: _this._domain };
                    if (!_this._domain) {
                        var message = 'Domain has not been set in app config';
                        console.error(message);
                        throw message;
                    }
                    if (_this._cache) {
                        options.cache = _this._cache;
                    }
                    if (_this._token) {
                        options.token = _this._token;
                    }
                    _this._otrServiceInstance = new OtrService(options);
                }
                return _this._otrServiceInstance;
            }
        ];
        return;
    }
    OtrServiceProvider.prototype.setDomain = function (domain) {
        this._domain = domain;
    };
    OtrServiceProvider.prototype.setCache = function (cache) {
        this._cache = cache;
    };
    OtrServiceProvider.prototype.setToken = function (token) {
        this._token = token;
    };
    return OtrServiceProvider;
}());
angular.module('otr-ui-shared-components').provider('otrService', OtrServiceProvider);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CourtsDropdownCtrl = /** @class */ (function () {
    function CourtsDropdownCtrl($scope, otrService) {
        this.$scope = $scope;
        this.otrService = otrService;
        this.inputClass = '';
        this.hasError = false;
        this.classes = this.inputClass;
        this.isDataLoading = false;
        this.findMatchingCourts = this.findMatchingCourts.bind(this);
    }
    CourtsDropdownCtrl.prototype.$onInit = function () { };
    CourtsDropdownCtrl.prototype.$onChanges = function (changes) {
        var _this = this;
        if (changes.hasError) {
            this.classes = this.inputClass + (this.hasError
                ? " has-error"
                : "");
        }
        if (changes.state && this.state) {
            this.fetchCourts()
                .then(function (courts) { return _this.initFuse(angular.copy(courts)); });
        }
    };
    CourtsDropdownCtrl.prototype.fetchCourts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 3]);
                        this.isDataLoading = true;
                        return [4 /*yield*/, this.otrService.findCourtsUsingGET({ state: this.state })];
                    case 1:
                        response = _a.sent();
                        this.courts = _.forEach(response.data.courts, function (court) {
                            court.customTitle = court.courtName;
                            court.customTitle += court.courtNameAdditional
                                ? ' – ' + court.courtNameAdditional
                                : '';
                            court.customTitle += court.courtCode
                                ? ' (' + court.courtCode + ')'
                                : '';
                            court.customDescription = court.address.city + ', '
                                + court.address.regionCode + ' '
                                + court.address.postalCode + ' – '
                                + court.address.countyName + ' County';
                        });
                        return [2 /*return*/, this.courts];
                    case 2:
                        this.isDataLoading = false;
                        this.$scope.$apply();
                        return [7 /*endfinally*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
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
        var allKeysResults = _.sortBy(this.fuseAllKeys.search(query), 'courtId');
        var courtCodeResults = _.sortBy(this.fuseCourtCode.search(query), 'courtId');
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
    return CourtsDropdownCtrl;
}());
angular
    .module('otr-ui-shared-components')
    .component('appCourtsDropdown', {
    controller: CourtsDropdownCtrl,
    controllerAs: 'vm',
    templateUrl: 'app/components/courts-dropdown/courts-dropdown.component.html',
    bindings: {
        onSelectCourt: '&',
        inputClass: '@',
        hasError: '<',
        state: '@'
    }
});
CourtsDropdownCtrl.$inject = ['$scope', 'otrService'];

angular.module('otr-ui-shared-components.tpls', []).run(['$templateCache', function($templateCache) {$templateCache.put('/otr-search-template.html','<div class="angucomplete-holder"\n     ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">\n\n     <span>\n        <input ng-model="searchStr"\n               ng-disabled="disableInput"\n               type="text"\n               placeholder="{{placeholder}}"\n               ng-focus="onFocusHandler()"\n               class="{{inputClass}}"\n               ng-blur="hideResults($event)"\n               autocapitalize="off"\n               autocorrect="off"\n               autocomplete="off"\n               ng-change="inputChangeHandler(searchStr)"/>\n          <span ng-switch="$parent.vm.isDataLoading">\n              <span ng-switch-when="true">\n                  <i style="position: relative; top: 1px; right: 35px;" class="fa fa-pulse fa-spinner"></i>\n              </span>\n              <span ng-switch-default>\n                  <i style="position: relative; top: 1px; right: 35px;" class="fa fa-angle-down"></i>\n              </span>\n          </span>\n     </span>\n\n    <div class="angucomplete-dropdown otr-angucomplete-dropdown"\n       ng-show="showDropdown">\n      <div class="angucomplete-searching"\n           ng-show="searching"\n           ng-bind="textSearching">\n      </div>\n      <div class="angucomplete-searching"\n           ng-show="!searching && (!results || results.length == 0)"\n           ng-bind="textNoResults">\n      </div>\n\n      <div class="otr-angucomplete-row angucomplete-row"\n         ng-repeat="result in results"\n         ng-click="(selectResult(result))"\n         ng-mouseenter="hoverRow($index)"\n         ng-class="{\'otr-angucomplete-selected-row\': $index == currentIndex}">\n\n        <div class="angucomplete-title"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.title}}"\n             fuse-highlight-key="customTitle">\n        </div>\n        <div class="angucomplete-description"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.description}}"\n             fuse-highlight-key="customDescription">\n        </div>\n      </div>\n    </div>\n</div>');
$templateCache.put('/components/courts-dropdown/courts-dropdown.component.html','<div class="otr-dropdown">\n    <angucomplete-alt\n        template-url="/otr-search-template.html"\n        id="courts-search-bar"\n        placeholder="e.g. Seattle Municipal Court"\n        pause="200"\n        selected-object="vm.onSelectCourt()"\n        local-data="vm.courts"\n        local-search="vm.findMatchingCourts"\n        title-field="customTitle"\n        description-field="customDescription"\n        minlength="0"\n        auto-match="true"\n        text-no-results="Enter the court name, city, county, address, or zip code."\n        text-searching="Searching courts..."\n        input-class="{{vm.classes}}"\n        disable-input="vm.isDataLoading"\n        clear-selected="true"\n        ng-keydown="vm.isCourtFormSubmitted = false"\n    />\n</div>');}]);
"use strict";
angular.module('otr-ui-shared-components', ['angucomplete-alt', 'otrBackendService', 'otr-ui-shared-components.tpls']);

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
    .module('otr-ui-shared-components')
    .directive('otrFuseHighlight', fuseHighlightDirective);

"use strict";
var OtrServiceProvider = /** @class */ (function () {
    function OtrServiceProvider() {
        var _this = this;
        this.$get = [
            'OtrService',
            function (OtrService) {
                if (!_this._otrServiceInstance) {
                    var options = { domain: _this._domain };
                    if (!_this._domain) {
                        var message = 'Domain has not been set in app config';
                        console.error(message);
                        throw message;
                    }
                    if (_this._cache) {
                        options.cache = _this._cache;
                    }
                    if (_this._token) {
                        options.token = _this._token;
                    }
                    _this._otrServiceInstance = new OtrService(options);
                }
                return _this._otrServiceInstance;
            }
        ];
        return;
    }
    OtrServiceProvider.prototype.setDomain = function (domain) {
        this._domain = domain;
    };
    OtrServiceProvider.prototype.setCache = function (cache) {
        this._cache = cache;
    };
    OtrServiceProvider.prototype.setToken = function (token) {
        this._token = token;
    };
    return OtrServiceProvider;
}());
angular.module('otr-ui-shared-components').provider('otrService', OtrServiceProvider);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CourtsDropdownCtrl = /** @class */ (function () {
    function CourtsDropdownCtrl($scope, otrService) {
        this.$scope = $scope;
        this.otrService = otrService;
        this.inputClass = '';
        this.hasError = false;
        this.classes = this.inputClass;
        this.isDataLoading = false;
        this.findMatchingCourts = this.findMatchingCourts.bind(this);
    }
    CourtsDropdownCtrl.prototype.$onInit = function () { };
    CourtsDropdownCtrl.prototype.$onChanges = function (changes) {
        var _this = this;
        if (changes.hasError) {
            this.classes = this.inputClass + (this.hasError
                ? " has-error"
                : "");
        }
        if (changes.state && this.state) {
            this.fetchCourts()
                .then(function (courts) { return _this.initFuse(angular.copy(courts)); });
        }
    };
    CourtsDropdownCtrl.prototype.fetchCourts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 3]);
                        this.isDataLoading = true;
                        return [4 /*yield*/, this.otrService.findCourtsUsingGET({ state: this.state })];
                    case 1:
                        response = _a.sent();
                        this.courts = _.forEach(response.data.courts, function (court) {
                            court.customTitle = court.courtName;
                            court.customTitle += court.courtNameAdditional
                                ? ' – ' + court.courtNameAdditional
                                : '';
                            court.customTitle += court.courtCode
                                ? ' (' + court.courtCode + ')'
                                : '';
                            court.customDescription = court.address.city + ', '
                                + court.address.regionCode + ' '
                                + court.address.postalCode + ' – '
                                + court.address.countyName + ' County';
                        });
                        return [2 /*return*/, this.courts];
                    case 2:
                        this.isDataLoading = false;
                        this.$scope.$apply();
                        return [7 /*endfinally*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
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
        var allKeysResults = _.sortBy(this.fuseAllKeys.search(query), 'courtId');
        var courtCodeResults = _.sortBy(this.fuseCourtCode.search(query), 'courtId');
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
    return CourtsDropdownCtrl;
}());
angular
    .module('otr-ui-shared-components')
    .component('appCourtsDropdown', {
    controller: CourtsDropdownCtrl,
    controllerAs: 'vm',
    templateUrl: 'app/components/courts-dropdown/courts-dropdown.component.html',
    bindings: {
        onSelectCourt: '&',
        inputClass: '@',
        hasError: '<',
        state: '@'
    }
});
CourtsDropdownCtrl.$inject = ['$scope', 'otrService'];

angular.module('otr-ui-shared-components.tpls', []).run(['$templateCache', function($templateCache) {$templateCache.put('/otr-search-template.html','<div class="angucomplete-holder"\n     ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">\n\n     <span>\n        <input ng-model="searchStr"\n               ng-disabled="disableInput"\n               type="text"\n               placeholder="{{placeholder}}"\n               ng-focus="onFocusHandler()"\n               class="{{inputClass}}"\n               ng-blur="hideResults($event)"\n               autocapitalize="off"\n               autocorrect="off"\n               autocomplete="off"\n               ng-change="inputChangeHandler(searchStr)"/>\n          <span ng-switch="$parent.vm.isDataLoading">\n              <span ng-switch-when="true">\n                  <i class="otr-dropdown__icon fa fa-pulse fa-spinner"></i>\n              </span>\n              <span ng-switch-default>\n                  <i class="otr-dropdown__icon fa fa-angle-down"></i>\n              </span>\n          </span>\n     </span>\n\n    <div class="angucomplete-dropdown otr-angucomplete-dropdown"\n       ng-show="showDropdown">\n      <div class="angucomplete-searching"\n           ng-show="searching"\n           ng-bind="textSearching">\n      </div>\n      <div class="angucomplete-searching"\n           ng-show="!searching && (!results || results.length == 0)"\n           ng-bind="textNoResults">\n      </div>\n\n      <div class="otr-angucomplete-row angucomplete-row"\n         ng-repeat="result in results"\n         ng-click="(selectResult(result))"\n         ng-mouseenter="hoverRow($index)"\n         ng-class="{\'otr-angucomplete-selected-row\': $index == currentIndex}">\n\n        <div class="angucomplete-title"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.title}}"\n             fuse-highlight-key="customTitle">\n        </div>\n        <div class="angucomplete-description"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.description}}"\n             fuse-highlight-key="customDescription">\n        </div>\n      </div>\n    </div>\n</div>');
$templateCache.put('/components/courts-dropdown/courts-dropdown.component.html','<div class="otr-dropdown">\n    <angucomplete-alt\n        template-url="/otr-search-template.html"\n        id="courts-search-bar"\n        placeholder="e.g. Seattle Municipal Court"\n        pause="200"\n        selected-object="vm.onSelectCourt()"\n        local-data="vm.courts"\n        local-search="vm.findMatchingCourts"\n        title-field="customTitle"\n        description-field="customDescription"\n        minlength="0"\n        auto-match="true"\n        text-no-results="Enter the court name, city, county, address, or zip code."\n        text-searching="Searching courts..."\n        input-class="{{vm.classes}}"\n        disable-input="vm.isDataLoading"\n        clear-selected="true"\n        ng-keydown="vm.isCourtFormSubmitted = false"\n    />\n</div>');}]);
"use strict";
angular.module('otr-ui-shared-components', ['angucomplete-alt', 'otrBackendService', 'otr-ui-shared-components.tpls']);

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
    .module('otr-ui-shared-components')
    .directive('otrFuseHighlight', fuseHighlightDirective);

"use strict";
var OtrServiceProvider = /** @class */ (function () {
    function OtrServiceProvider() {
        var _this = this;
        this.$get = [
            'OtrService',
            function (OtrService) {
                if (!_this._otrServiceInstance) {
                    var options = { domain: _this._domain };
                    if (!_this._domain) {
                        var message = 'Domain has not been set in app config';
                        console.error(message);
                        throw message;
                    }
                    if (_this._cache) {
                        options.cache = _this._cache;
                    }
                    if (_this._token) {
                        options.token = _this._token;
                    }
                    _this._otrServiceInstance = new OtrService(options);
                }
                return _this._otrServiceInstance;
            }
        ];
        return;
    }
    OtrServiceProvider.prototype.setDomain = function (domain) {
        this._domain = domain;
    };
    OtrServiceProvider.prototype.setCache = function (cache) {
        this._cache = cache;
    };
    OtrServiceProvider.prototype.setToken = function (token) {
        this._token = token;
    };
    return OtrServiceProvider;
}());
angular.module('otr-ui-shared-components').provider('otrService', OtrServiceProvider);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CourtsDropdownCtrl = /** @class */ (function () {
    function CourtsDropdownCtrl($scope, otrService) {
        this.$scope = $scope;
        this.otrService = otrService;
        this.inputClass = '';
        this.hasError = false;
        this.classes = this.inputClass;
        this.isDataLoading = false;
        this.findMatchingCourts = this.findMatchingCourts.bind(this);
    }
    CourtsDropdownCtrl.prototype.$onInit = function () { };
    CourtsDropdownCtrl.prototype.$onChanges = function (changes) {
        var _this = this;
        if (changes.hasError) {
            this.classes = this.inputClass + (this.hasError
                ? " has-error"
                : "");
        }
        if (changes.state && this.state) {
            this.fetchCourts()
                .then(function (courts) { return _this.initFuse(angular.copy(courts)); });
        }
    };
    CourtsDropdownCtrl.prototype.fetchCourts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 3]);
                        this.isDataLoading = true;
                        return [4 /*yield*/, this.otrService.findCourtsUsingGET({ state: this.state })];
                    case 1:
                        response = _a.sent();
                        this.courts = _.forEach(response.data.courts, function (court) {
                            court.customTitle = court.courtName;
                            court.customTitle += court.courtNameAdditional
                                ? ' – ' + court.courtNameAdditional
                                : '';
                            court.customTitle += court.courtCode
                                ? ' (' + court.courtCode + ')'
                                : '';
                            court.customDescription = court.address.city + ', '
                                + court.address.regionCode + ' '
                                + court.address.postalCode + ' – '
                                + court.address.countyName + ' County';
                        });
                        return [2 /*return*/, this.courts];
                    case 2:
                        this.isDataLoading = false;
                        this.$scope.$apply();
                        return [7 /*endfinally*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
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
        var allKeysResults = _.sortBy(this.fuseAllKeys.search(query), 'courtId');
        var courtCodeResults = _.sortBy(this.fuseCourtCode.search(query), 'courtId');
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
    return CourtsDropdownCtrl;
}());
angular
    .module('otr-ui-shared-components')
    .component('appCourtsDropdown', {
    controller: CourtsDropdownCtrl,
    controllerAs: 'vm',
    templateUrl: 'app/components/courts-dropdown/courts-dropdown.component.html',
    bindings: {
        onSelectCourt: '&',
        inputClass: '@',
        hasError: '<',
        state: '@'
    }
});
CourtsDropdownCtrl.$inject = ['$scope', 'otrService'];

angular.module('otr-ui-shared-components.tpls', []).run(['$templateCache', function($templateCache) {$templateCache.put('/otr-search-template.html','<div class="angucomplete-holder"\n     ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">\n\n     <span>\n        <input ng-model="searchStr"\n               ng-disabled="disableInput"\n               type="text"\n               placeholder="{{placeholder}}"\n               ng-focus="onFocusHandler()"\n               class="{{inputClass}}"\n               ng-blur="hideResults($event)"\n               autocapitalize="off"\n               autocorrect="off"\n               autocomplete="off"\n               ng-change="inputChangeHandler(searchStr)"/>\n          <span ng-switch="$parent.vm.isDataLoading">\n              <span ng-switch-when="true">\n                  <i class="otr-dropdown__icon fa fa-pulse fa-spinner"></i>\n              </span>\n              <span ng-switch-default>\n                  <i class="otr-dropdown__icon fa fa-angle-down"></i>\n              </span>\n          </span>\n     </span>\n\n    <div class="angucomplete-dropdown otr-angucomplete-dropdown"\n       ng-show="showDropdown">\n      <div class="angucomplete-searching"\n           ng-show="searching"\n           ng-bind="textSearching">\n      </div>\n      <div class="angucomplete-searching"\n           ng-show="!searching && (!results || results.length == 0)"\n           ng-bind="textNoResults">\n      </div>\n\n      <div class="otr-angucomplete-row angucomplete-row"\n         ng-repeat="result in results"\n         ng-click="(selectResult(result))"\n         ng-mouseenter="hoverRow($index)"\n         ng-class="{\'otr-angucomplete-selected-row\': $index == currentIndex}">\n\n        <div class="angucomplete-title"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.title}}"\n             fuse-highlight-key="customTitle">\n        </div>\n        <div class="angucomplete-description"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.description}}"\n             fuse-highlight-key="customDescription">\n        </div>\n      </div>\n    </div>\n</div>');
$templateCache.put('/components/courts-dropdown/courts-dropdown.component.html','<div class="otr-dropdown">\n    <angucomplete-alt\n        template-url="/otr-search-template.html"\n        id="courts-search-bar"\n        placeholder="e.g. Seattle Municipal Court"\n        pause="200"\n        selected-object="vm.onSelectCourt()"\n        local-data="vm.courts"\n        local-search="vm.findMatchingCourts"\n        title-field="customTitle"\n        description-field="customDescription"\n        minlength="0"\n        auto-match="true"\n        text-no-results="Enter the court name, city, county, address, or zip code."\n        text-searching="Searching courts..."\n        input-class="{{vm.classes}}"\n        disable-input="vm.isDataLoading"\n        clear-selected="true"\n        ng-keydown="vm.isCourtFormSubmitted = false"\n    />\n</div>');}]);
"use strict";
angular.module('otr-ui-shared-components', ['angucomplete-alt', 'otrBackendService', 'otr-ui-shared-components.tpls']);

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
    .module('otr-ui-shared-components')
    .directive('otrFuseHighlight', fuseHighlightDirective);

"use strict";
var OtrServiceProvider = /** @class */ (function () {
    function OtrServiceProvider() {
        var _this = this;
        this.$get = [
            'OtrService',
            function (OtrService) {
                if (!_this._otrServiceInstance) {
                    var options = { domain: _this._domain };
                    if (!_this._domain) {
                        var message = 'Domain has not been set in app config';
                        console.error(message);
                        throw message;
                    }
                    if (_this._cache) {
                        options.cache = _this._cache;
                    }
                    if (_this._token) {
                        options.token = _this._token;
                    }
                    _this._otrServiceInstance = new OtrService(options);
                }
                return _this._otrServiceInstance;
            }
        ];
        return;
    }
    OtrServiceProvider.prototype.setDomain = function (domain) {
        this._domain = domain;
    };
    OtrServiceProvider.prototype.setCache = function (cache) {
        this._cache = cache;
    };
    OtrServiceProvider.prototype.setToken = function (token) {
        this._token = token;
    };
    return OtrServiceProvider;
}());
angular.module('otr-ui-shared-components').provider('otrService', OtrServiceProvider);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CourtsDropdownCtrl = /** @class */ (function () {
    function CourtsDropdownCtrl($scope, otrService) {
        this.$scope = $scope;
        this.otrService = otrService;
        this.inputClass = '';
        this.hasError = false;
        this.classes = this.inputClass;
        this.isDataLoading = false;
        this.findMatchingCourts = this.findMatchingCourts.bind(this);
    }
    CourtsDropdownCtrl.prototype.$onInit = function () { };
    CourtsDropdownCtrl.prototype.$onChanges = function (changes) {
        var _this = this;
        if (changes.hasError) {
            this.classes = this.inputClass + (this.hasError
                ? " has-error"
                : "");
        }
        if (changes.state && this.state) {
            this.fetchCourts()
                .then(function (courts) { return _this.initFuse(angular.copy(courts)); });
        }
    };
    CourtsDropdownCtrl.prototype.fetchCourts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 3]);
                        this.isDataLoading = true;
                        return [4 /*yield*/, this.otrService.findCourtsUsingGET({ state: this.state })];
                    case 1:
                        response = _a.sent();
                        this.courts = _.forEach(response.data.courts, function (court) {
                            court.customTitle = court.courtName;
                            court.customTitle += court.courtNameAdditional
                                ? ' – ' + court.courtNameAdditional
                                : '';
                            court.customTitle += court.courtCode
                                ? ' (' + court.courtCode + ')'
                                : '';
                            court.customDescription = court.address.city + ', '
                                + court.address.regionCode + ' '
                                + court.address.postalCode + ' – '
                                + court.address.countyName + ' County';
                        });
                        return [2 /*return*/, this.courts];
                    case 2:
                        this.isDataLoading = false;
                        this.$scope.$apply();
                        return [7 /*endfinally*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
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
        var allKeysResults = _.sortBy(this.fuseAllKeys.search(query), 'courtId');
        var courtCodeResults = _.sortBy(this.fuseCourtCode.search(query), 'courtId');
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
    return CourtsDropdownCtrl;
}());
angular
    .module('otr-ui-shared-components')
    .component('appCourtsDropdown', {
    controller: CourtsDropdownCtrl,
    controllerAs: 'vm',
    templateUrl: 'app/components/courts-dropdown/courts-dropdown.component.html',
    bindings: {
        onSelectCourt: '&',
        inputClass: '@',
        hasError: '<',
        state: '@'
    }
});
CourtsDropdownCtrl.$inject = ['$scope', 'otrService'];

angular.module('otr-ui-shared-components.tpls', []).run(['$templateCache', function($templateCache) {$templateCache.put('/otr-search-template.html','<div class="angucomplete-holder"\n     ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">\n\n     <span>\n        <input ng-model="searchStr"\n               ng-disabled="disableInput"\n               type="text"\n               placeholder="{{placeholder}}"\n               ng-focus="onFocusHandler()"\n               class="{{inputClass}}"\n               ng-blur="hideResults($event)"\n               autocapitalize="off"\n               autocorrect="off"\n               autocomplete="off"\n               ng-change="inputChangeHandler(searchStr)"/>\n          <span ng-switch="$parent.vm.isDataLoading">\n              <span ng-switch-when="true">\n                  <i class="otr-dropdown__icon fa fa-pulse fa-spinner"></i>\n              </span>\n              <span ng-switch-default>\n                  <i class="otr-dropdown__icon fa fa-angle-down"></i>\n              </span>\n          </span>\n     </span>\n\n    <div class="angucomplete-dropdown otr-angucomplete-dropdown"\n       ng-show="showDropdown">\n      <div class="angucomplete-searching"\n           ng-show="searching"\n           ng-bind="textSearching">\n      </div>\n      <div class="angucomplete-searching"\n           ng-show="!searching && (!results || results.length == 0)"\n           ng-bind="textNoResults">\n      </div>\n\n      <div class="otr-angucomplete-row angucomplete-row"\n         ng-repeat="result in results"\n         ng-click="(selectResult(result))"\n         ng-mouseenter="hoverRow($index)"\n         ng-class="{\'otr-angucomplete-selected-row\': $index == currentIndex}">\n\n        <div class="angucomplete-title"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.title}}"\n             fuse-highlight-key="customTitle">\n        </div>\n        <div class="angucomplete-description"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.description}}"\n             fuse-highlight-key="customDescription">\n        </div>\n      </div>\n    </div>\n</div>');
$templateCache.put('/components/courts-dropdown/courts-dropdown.component.html','<div class="otr-dropdown">\n    <angucomplete-alt\n        template-url="/otr-search-template.html"\n        id="courts-search-bar"\n        placeholder="e.g. Seattle Municipal Court"\n        pause="200"\n        selected-object="vm.onSelectCourt()"\n        local-data="vm.courts"\n        local-search="vm.findMatchingCourts"\n        title-field="customTitle"\n        description-field="customDescription"\n        minlength="0"\n        auto-match="true"\n        text-no-results="Enter the court name, city, county, address, or zip code."\n        text-searching="Searching courts..."\n        input-class="{{vm.classes}}"\n        disable-input="vm.isDataLoading"\n        clear-selected="true"\n        ng-keydown="vm.isCourtFormSubmitted = false"\n    />\n</div>');}]);
"use strict";
angular.module('otr-ui-shared-components', ['angucomplete-alt', 'otrBackendService', 'otr-ui-shared-components.tpls']);

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
    .module('otr-ui-shared-components')
    .directive('otrFuseHighlight', fuseHighlightDirective);

"use strict";
var OtrServiceProvider = /** @class */ (function () {
    function OtrServiceProvider() {
        var _this = this;
        this.$get = [
            'OtrService',
            function (OtrService) {
                if (!_this._otrServiceInstance) {
                    var options = { domain: _this._domain };
                    if (!_this._domain) {
                        var message = 'Domain has not been set in app config';
                        console.error(message);
                        throw message;
                    }
                    if (_this._cache) {
                        options.cache = _this._cache;
                    }
                    if (_this._token) {
                        options.token = _this._token;
                    }
                    _this._otrServiceInstance = new OtrService(options);
                }
                return _this._otrServiceInstance;
            }
        ];
        return;
    }
    OtrServiceProvider.prototype.setDomain = function (domain) {
        this._domain = domain;
    };
    OtrServiceProvider.prototype.setCache = function (cache) {
        this._cache = cache;
    };
    OtrServiceProvider.prototype.setToken = function (token) {
        this._token = token;
    };
    return OtrServiceProvider;
}());
angular.module('otr-ui-shared-components').provider('otrService', OtrServiceProvider);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CourtsDropdownCtrl = /** @class */ (function () {
    function CourtsDropdownCtrl($scope, otrService) {
        this.$scope = $scope;
        this.otrService = otrService;
        this.inputClass = '';
        this.hasError = false;
        this.classes = this.inputClass;
        this.isDataLoading = false;
        this.findMatchingCourts = this.findMatchingCourts.bind(this);
    }
    CourtsDropdownCtrl.prototype.$onInit = function () { };
    CourtsDropdownCtrl.prototype.$onChanges = function (changes) {
        var _this = this;
        if (changes.hasError) {
            this.classes = this.inputClass + (this.hasError
                ? " has-error"
                : "");
        }
        if (changes.state && this.state) {
            this.fetchCourts()
                .then(function (courts) { return _this.initFuse(angular.copy(courts)); });
        }
    };
    CourtsDropdownCtrl.prototype.fetchCourts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 3]);
                        this.isDataLoading = true;
                        return [4 /*yield*/, this.otrService.findCourtsUsingGET({ state: this.state })];
                    case 1:
                        response = _a.sent();
                        this.courts = _.forEach(response.data.courts, function (court) {
                            court.customTitle = court.courtName;
                            court.customTitle += court.courtNameAdditional
                                ? ' – ' + court.courtNameAdditional
                                : '';
                            court.customTitle += court.courtCode
                                ? ' (' + court.courtCode + ')'
                                : '';
                            court.customDescription = court.address.city + ', '
                                + court.address.regionCode + ' '
                                + court.address.postalCode + ' – '
                                + court.address.countyName + ' County';
                        });
                        return [2 /*return*/, this.courts];
                    case 2:
                        this.isDataLoading = false;
                        this.$scope.$apply();
                        return [7 /*endfinally*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
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
        var allKeysResults = _.sortBy(this.fuseAllKeys.search(query), 'courtId');
        var courtCodeResults = _.sortBy(this.fuseCourtCode.search(query), 'courtId');
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
    return CourtsDropdownCtrl;
}());
angular
    .module('otr-ui-shared-components')
    .component('appCourtsDropdown', {
    controller: CourtsDropdownCtrl,
    controllerAs: 'vm',
    templateUrl: 'app/components/courts-dropdown/courts-dropdown.component.html',
    bindings: {
        onSelectCourt: '&',
        inputClass: '@',
        hasError: '<',
        state: '@'
    }
});
CourtsDropdownCtrl.$inject = ['$scope', 'otrService'];

angular.module('otr-ui-shared-components.tpls', []).run(['$templateCache', function($templateCache) {$templateCache.put('/otr-search-template.html','<div class="angucomplete-holder"\n     ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">\n\n     <span>\n        <input ng-model="searchStr"\n               ng-disabled="disableInput"\n               type="text"\n               placeholder="{{placeholder}}"\n               ng-focus="onFocusHandler()"\n               class="{{inputClass}}"\n               ng-blur="hideResults($event)"\n               autocapitalize="off"\n               autocorrect="off"\n               autocomplete="off"\n               ng-change="inputChangeHandler(searchStr)"/>\n          <span ng-switch="$parent.vm.isDataLoading">\n              <span ng-switch-when="true">\n                  <i class="otr-dropdown__icon fa fa-pulse fa-spinner"></i>\n              </span>\n              <span ng-switch-default>\n                  <i class="otr-dropdown__icon fa fa-angle-down"></i>\n              </span>\n          </span>\n     </span>\n\n    <div class="angucomplete-dropdown otr-angucomplete-dropdown"\n       ng-show="showDropdown">\n      <div class="angucomplete-searching"\n           ng-show="searching"\n           ng-bind="textSearching">\n      </div>\n      <div class="angucomplete-searching"\n           ng-show="!searching && (!results || results.length == 0)"\n           ng-bind="textNoResults">\n      </div>\n\n      <div class="otr-angucomplete-row angucomplete-row"\n         ng-repeat="result in results"\n         ng-click="(selectResult(result))"\n         ng-mouseenter="hoverRow($index)"\n         ng-class="{\'otr-angucomplete-selected-row\': $index == currentIndex}">\n\n        <div class="angucomplete-title"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.title}}"\n             fuse-highlight-key="customTitle">\n        </div>\n        <div class="angucomplete-description"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.description}}"\n             fuse-highlight-key="customDescription">\n        </div>\n      </div>\n    </div>\n</div>');
$templateCache.put('/components/courts-dropdown/courts-dropdown.component.html','<div class="otr-dropdown">\n    <angucomplete-alt\n        template-url="/otr-search-template.html"\n        id="courts-search-bar"\n        placeholder="e.g. Seattle Municipal Court"\n        pause="200"\n        selected-object="vm.onSelectCourt()"\n        local-data="vm.courts"\n        local-search="vm.findMatchingCourts"\n        title-field="customTitle"\n        description-field="customDescription"\n        minlength="0"\n        auto-match="true"\n        text-no-results="Enter the court name, city, county, address, or zip code."\n        text-searching="Searching courts..."\n        input-class="{{vm.classes}}"\n        disable-input="vm.isDataLoading"\n        clear-selected="true"\n        ng-keydown="vm.isCourtFormSubmitted = false"\n    />\n</div>');}]);
"use strict";
angular.module('otr-ui-shared-components', ['angucomplete-alt', 'otrBackendService', 'otr-ui-shared-components.tpls']);

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
    .module('otr-ui-shared-components')
    .directive('otrFuseHighlight', fuseHighlightDirective);

"use strict";
var OtrServiceProvider = /** @class */ (function () {
    function OtrServiceProvider() {
        var _this = this;
        this.$get = [
            'OtrService',
            function (OtrService) {
                if (!_this._otrServiceInstance) {
                    var options = { domain: _this._domain };
                    if (!_this._domain) {
                        var message = 'Domain has not been set in app config';
                        console.error(message);
                        throw message;
                    }
                    if (_this._cache) {
                        options.cache = _this._cache;
                    }
                    if (_this._token) {
                        options.token = _this._token;
                    }
                    _this._otrServiceInstance = new OtrService(options);
                }
                return _this._otrServiceInstance;
            }
        ];
        return;
    }
    OtrServiceProvider.prototype.setDomain = function (domain) {
        this._domain = domain;
    };
    OtrServiceProvider.prototype.setCache = function (cache) {
        this._cache = cache;
    };
    OtrServiceProvider.prototype.setToken = function (token) {
        this._token = token;
    };
    return OtrServiceProvider;
}());
angular.module('otr-ui-shared-components').provider('otrService', OtrServiceProvider);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CourtsDropdownCtrl = /** @class */ (function () {
    function CourtsDropdownCtrl($scope, otrService) {
        this.$scope = $scope;
        this.otrService = otrService;
        this.inputClass = '';
        this.hasError = false;
        this.classes = this.inputClass;
        this.isDataLoading = false;
        this.findMatchingCourts = this.findMatchingCourts.bind(this);
    }
    CourtsDropdownCtrl.prototype.$onInit = function () { };
    CourtsDropdownCtrl.prototype.$onChanges = function (changes) {
        var _this = this;
        if (changes.hasError) {
            this.classes = this.inputClass + (this.hasError
                ? " has-error"
                : "");
        }
        if (changes.state && this.state) {
            this.fetchCourts()
                .then(function (courts) { return _this.initFuse(angular.copy(courts)); });
        }
    };
    CourtsDropdownCtrl.prototype.fetchCourts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 3]);
                        this.isDataLoading = true;
                        return [4 /*yield*/, this.otrService.findCourtsUsingGET({ state: this.state })];
                    case 1:
                        response = _a.sent();
                        this.courts = _.forEach(response.data.courts, function (court) {
                            court.customTitle = court.courtName;
                            court.customTitle += court.courtNameAdditional
                                ? ' – ' + court.courtNameAdditional
                                : '';
                            court.customTitle += court.courtCode
                                ? ' (' + court.courtCode + ')'
                                : '';
                            court.customDescription = court.address.city + ', '
                                + court.address.regionCode + ' '
                                + court.address.postalCode + ' – '
                                + court.address.countyName + ' County';
                        });
                        return [2 /*return*/, this.courts];
                    case 2:
                        this.isDataLoading = false;
                        this.$scope.$apply();
                        return [7 /*endfinally*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
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
        var allKeysResults = _.sortBy(this.fuseAllKeys.search(query), 'courtId');
        var courtCodeResults = _.sortBy(this.fuseCourtCode.search(query), 'courtId');
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
    return CourtsDropdownCtrl;
}());
angular
    .module('otr-ui-shared-components')
    .component('appCourtsDropdown', {
    controller: CourtsDropdownCtrl,
    controllerAs: 'vm',
    templateUrl: 'app/components/courts-dropdown/courts-dropdown.component.html',
    bindings: {
        onSelectCourt: '&',
        inputClass: '@',
        hasError: '<',
        state: '@'
    }
});
CourtsDropdownCtrl.$inject = ['$scope', 'otrService'];

angular.module('otr-ui-shared-components.tpls', []).run(['$templateCache', function($templateCache) {$templateCache.put('/otr-search-template.html','<div class="angucomplete-holder"\n     ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">\n\n     <span>\n        <input ng-model="searchStr"\n               ng-disabled="disableInput"\n               type="text"\n               placeholder="{{placeholder}}"\n               ng-focus="onFocusHandler()"\n               class="{{inputClass}}"\n               ng-blur="hideResults($event)"\n               autocapitalize="off"\n               autocorrect="off"\n               autocomplete="off"\n               ng-change="inputChangeHandler(searchStr)"/>\n          <span ng-switch="$parent.vm.isDataLoading">\n              <span ng-switch-when="true">\n                  <i class="otr-dropdown__icon fa fa-pulse fa-spinner"></i>\n              </span>\n              <span ng-switch-default>\n                  <i class="otr-dropdown__icon fa fa-angle-down"></i>\n              </span>\n          </span>\n     </span>\n\n    <div class="angucomplete-dropdown otr-angucomplete-dropdown"\n       ng-show="showDropdown">\n      <div class="angucomplete-searching"\n           ng-show="searching"\n           ng-bind="textSearching">\n      </div>\n      <div class="angucomplete-searching"\n           ng-show="!searching && (!results || results.length == 0)"\n           ng-bind="textNoResults">\n      </div>\n\n      <div class="otr-angucomplete-row angucomplete-row"\n         ng-repeat="result in results"\n         ng-click="(selectResult(result))"\n         ng-mouseenter="hoverRow($index)"\n         ng-class="{\'otr-angucomplete-selected-row\': $index == currentIndex}">\n\n        <div class="angucomplete-title"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.title}}"\n             fuse-highlight-key="customTitle">\n        </div>\n        <div class="angucomplete-description"\n             otr-fuse-highlight\n             fuse-highlight-bind="{{result.description}}"\n             fuse-highlight-key="customDescription">\n        </div>\n      </div>\n    </div>\n</div>');
$templateCache.put('/components/courts-dropdown/courts-dropdown.component.html','<div class="otr-dropdown">\n    <angucomplete-alt\n        template-url="/otr-search-template.html"\n        id="courts-search-bar"\n        placeholder="e.g. Seattle Municipal Court"\n        pause="200"\n        selected-object="vm.onSelectCourt()"\n        local-data="vm.courts"\n        local-search="vm.findMatchingCourts"\n        title-field="customTitle"\n        description-field="customDescription"\n        minlength="0"\n        auto-match="true"\n        text-no-results="Enter the court name, city, county, address, or zip code."\n        text-searching="Searching courts..."\n        input-class="{{vm.classes}}"\n        disable-input="vm.isDataLoading"\n        clear-selected="true"\n        ng-keydown="vm.isCourtFormSubmitted = false"\n    />\n</div>');}]);