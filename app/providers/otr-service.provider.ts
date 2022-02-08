class OtrServiceProvider {
    private _domain;
    private _cache;
    private _token;
    private _otrServiceInstance;

    constructor() {
        return;
    }

    public setDomain(domain) {
        this._domain = domain;
    }

    public setCache(cache) {
        this._cache = cache;
    }

    public setToken(token) {
        this._token = token;
    }

    public $get: any = [
        'OtrService',
        (OtrService: any) => {
            if (!this._otrServiceInstance) {
                const options: any = { domain: this._domain };

                if (!this._domain) {
                    const message = 'Domain has not been set in app config';
                    console.error(message);
                    throw message;
                }

                if (this._cache) {
                    options.cache = this._cache;
                }

                if (this._token) {
                    options.token = this._token;
                }

                this._otrServiceInstance = new OtrService(options);
            }
            return this._otrServiceInstance;
        }
    ];
}

angular.module('otr-ui-shared-components').provider('otrService', OtrServiceProvider);
