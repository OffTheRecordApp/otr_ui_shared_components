angular.module('otr-ui-shared-components.tpls', []).run(['$templateCache', function($templateCache) {$templateCache.put('/components/courts-dropdown/courts-dropdown.component.html','<script type="text/ng-template" id="/courts-dropdown.html">\n    <div class="angucomplete-holder"\n         ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">\n    \n        <input id="otr-court-search" ng-model="searchStr"\n               ng-disabled="disableInput"\n               type="text"\n               placeholder="{{placeholder}}"\n               ng-focus="onFocusHandler()"\n               class="{{inputClass}}"\n               ng-blur="hideResults($event)"\n               autocapitalize="off"\n               autocorrect="off"\n               autocomplete="off"\n               ng-change="inputChangeHandler(searchStr)"/>\n\n        <div class="angucomplete-dropdown otr-angucomplete-dropdown"\n             ng-show="showDropdown">\n            <div class="angucomplete-searching"\n                 ng-show="searching"\n                 ng-bind="textSearching">\n            </div>\n            <div class="angucomplete-searching"\n                 ng-show="!searching && (!results || results.length == 0)"\n                 ng-bind="textNoResults">\n            </div>\n\n            <div class="otr-angucomplete-row angucomplete-row"\n                 ng-repeat="result in results"\n                 ng-click="(selectResult(result))" \n                 ng-mouseenter="hoverRow($index)"\n                 ng-class="{\'otr-angucomplete-selected-row\': $index == currentIndex}">\n\n                <div class="angucomplete-title"\n                     otr-fuse-highlight\n                     fuse-highlight-bind="{{result.title}}"\n                     fuse-highlight-key="customTitle">\n                </div>\n                <div class="angucomplete-description"\n                     otr-fuse-highlight\n                     fuse-highlight-bind="{{result.description}}"\n                     fuse-highlight-key="customDescription">\n                </div>\n            </div>\n        </div>\n    </div>\n</script>\n\n<div class="otr-dropdown" ng-switch="vm.isCourtsLoading">\n    <span class="otr-dropdown__icon"\n          ng-switch-when="true">\n        <i class="fa fa-spinner fa-pulse"></i>\n    </span>\n    <span class="otr-dropdown__icon"\n          ng-switch-default>\n        <i class="fa fa-angle-down"></i>\n    </span>\n\n    <angucomplete-alt\n        template-url="/courts-dropdown.html"\n        id="courts-search-bar"\n        placeholder="e.g. Seattle Municipal Court"\n        pause="200"\n        selected-object="vm.onSelectCourt()"\n        local-data="vm.courts"\n        local-search="vm.findMatchingCourts"\n        title-field="customTitle"\n        description-field="customDescription"\n        minlength="0"\n        auto-match="true"\n        text-no-results="Enter the court name, city, county, address, or zip code."\n        text-searching="Searching courts..."\n        input-class="{{vm.classes}}"\n        disable-input="vm.isCourtsLoading"\n        clear-selected="true"\n        ng-keydown="vm.isCourtFormSubmitted = false"\n    />\n</div>');}]);