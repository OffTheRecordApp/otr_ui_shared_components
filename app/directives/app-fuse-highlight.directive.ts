/*
    DIRECTIVE ATTRIBUTES
        app-fuse-highlight:
            required to initiate directive
        fuse-highlight-bind="string":
            this is the string that will have the matching portions highlighted
        fuse-highlight-key="string":
            this string should match the key used in fuse's options.keys and should be used if multiple keys are being searched
*/
interface IFuseHighlightScope extends angular.IScope {
    result: any;
}

function fuseHighlightDirective() {
    return {
        restrict: 'A',
        link: (scope: IFuseHighlightScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
            let result: any = scope.result;
            const fullString: string = attrs.fuseHighlightBind;
            const matchKey: string = attrs.fuseHighlightKey;
            let isBestMatch: string = attrs.fuseHighlightBestMatch;
            let htmlString: string = '';
            let sliceStartingIndex: number = 0;
            let matches: any[] = _
                .chain(result)
                .get('originalObject.matches', [])
                // @ts-ignore
                .filter((match: any) => !matchKey || match.key === matchKey)
                .map('indices')
                .flatten()
                .value();
            let longestMatch: number = _
                .chain(matches)
                // @ts-ignore
                .map((match) => 1 + _.last(match) - _.first(match))
                .max()
                .value();

            for (let i: number = 0; i < matches.length; i++) {
                let matchStart: number = _.first(matches[i]) || 0;
                // @ts-ignore
                let matchEnd: number = 1 + _.last(matches[i]);
                let matchLength: number = matchEnd - matchStart;

                if (matchStart >= sliceStartingIndex) {
                    htmlString += fullString.slice(sliceStartingIndex, matchStart);

                    // Only highlight the upper half of the stretches of matches
                    if ((!isBestMatch && matchLength > longestMatch / 2)
                        || (isBestMatch && matchLength === longestMatch)) {
                        htmlString += '<span class="highlight">' + fullString.slice(matchStart, matchEnd) + '</span>';
                    } else {
                        htmlString += fullString.slice(matchStart, matchEnd);
                    }

                    sliceStartingIndex = matchEnd;
                }
            }

            htmlString += fullString.slice(sliceStartingIndex);
            element.html(htmlString);
        }
    }
}

angular
    .module('otr-ui-shared-components')
    .directive('otrFuseHighlight', fuseHighlightDirective);