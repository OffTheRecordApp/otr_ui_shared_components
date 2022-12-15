import { IServiceProvider } from 'angular';
import angular from 'angular';

export class BasePathProvider implements IServiceProvider {
    private _domain?: string;
    public setDomain(domain: string) {
        this._domain = domain;
    }
    public $get = [
        () => {
            return this._domain;
        }
    ];
}

angular.module('otr-ui-shared-components').provider('basePath', BasePathProvider);
