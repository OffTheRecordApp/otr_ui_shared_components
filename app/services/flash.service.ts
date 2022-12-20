import angular from 'angular';

export class FlashService {
    constructor(private $rootScope) {
        $rootScope.$on('$locationChangeStart', () => {
            this.clearFlashMessage();
        });
    }

    clearFlashMessage() {
        const flash = this.$rootScope.flash;
        if (flash) {
            if (!flash.keepAfterLocationChange) {
                delete this.$rootScope.flash;
            } else {
                // only keep for a single location change
                flash.keepAfterLocationChange = false;
            }
        }
    }

    Success(message: string, keepAfterLocationChange: boolean) {
        this.$rootScope.flash = {
            message: message,
            type: 'success',
            keepAfterLocationChange: keepAfterLocationChange
        };
    }

    Error(message: string, keepAfterLocationChange?: boolean) {
        this.$rootScope.flash = {
            message: message,
            type: 'error',
            keepAfterLocationChange: keepAfterLocationChange
        };
    }
}

angular.module('otr-ui-shared-components').service('FlashService', FlashService);

FlashService.$inject = ['$rootScope'];
