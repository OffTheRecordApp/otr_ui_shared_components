import angular from 'angular';
import otrSearchTemplate from './otr-search-template.html';

angular.module('otr-ui-shared-components', [
    'angucomplete-alt',
    'otrBackendService',
    'ui.bootstrap',
    'ngLetterAvatar'
]).run(['$templateCache', async function ($templateCache) {
    $templateCache.put('/otr-search-template.html', otrSearchTemplate);
}]);
