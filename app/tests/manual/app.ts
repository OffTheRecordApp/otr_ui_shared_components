import angular from 'angular';

angular
    .module('otr-ui-shared-components', [
        'angucomplete-alt',
        'otrBackendService',
        'ui.bootstrap',
        'ngLetterAvatar',
        'ui.router',
        'api',
        'angular-stripe',
        'credit-cards',
        'angularValidator'
    ])
    .constant('ENV', { stripePublishableKey: 'pk_test_fHIOKc7Sf7gNjwUIIT3XJfDt' });
