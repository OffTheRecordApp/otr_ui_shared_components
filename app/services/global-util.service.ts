import angular from 'angular';

export class GlobalUtils {
    public generateRandomString() {
        return Math.random().toString(36).slice(2);
    }
}

angular.module('otr-ui-shared-components').service('GlobalUtils', GlobalUtils);

GlobalUtils.$inject = [];
