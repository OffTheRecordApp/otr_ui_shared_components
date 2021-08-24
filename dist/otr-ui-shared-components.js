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
var ctrl = null;
var CourtsDropdownComponent = /** @class */ (function () {
    function CourtsDropdownComponent() {
        this.bindings = {
            onSelectCourt: '&',
            inputClass: '@',
            hasError: '<',
            state: '@'
        };
        this.controller = CourtsDropdownCtrl;
        this.controllerAs = 'vm';
        this.templateUrl = '/components/courts-dropdown/courts-dropdown.component.html';
    }
    return CourtsDropdownComponent;
}());
var CourtsDropdownCtrl = /** @class */ (function () {
    function CourtsDropdownCtrl(OtrService) {
        this.API_ENDPOINT = 'https://otr-backend-service-us-prod.offtherecord.com';
        this.inputClass = '';
        this.hasError = false;
        this.classes = this.inputClass;
        this.isCourtsLoading = false;
        this.otrService = new OtrService({ domain: this.API_ENDPOINT });
    }
    CourtsDropdownCtrl.prototype.$onInit = function () {
        ctrl = this;
    };
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
                        if (!this.otrService) return [3 /*break*/, 2];
                        this.isCourtsLoading = true;
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
                        this.isCourtsLoading = false;
                        return [2 /*return*/, this.courts];
                    case 2: throw 'Error instantiating otrService';
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
    CourtsDropdownCtrl.$inject = ['OtrService'];
    return CourtsDropdownCtrl;
}());
angular
    .module('courtsDropdown', [])
    .component('courtsDropdown', new CourtsDropdownComponent());
