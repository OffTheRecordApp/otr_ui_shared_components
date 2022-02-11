declare const Fuse: any;

interface CourtsDropdownBindings {
    inputClass: string;
    hasError: boolean;
    onSelectCourt: (selectedCourt: any) => any;
    state: string;
}

interface ICourtsDropdownCtrl extends CourtsDropdownBindings { // TODO: leverage generics here
    classes: string;
    $onInit: () => void;
    $onChanges: (changes: any) => void;
    findMatchingCourts: (query: string) => any[];
}

class CourtsDropdownCtrl implements ICourtsDropdownCtrl {
    public inputClass: string;
    public hasError: boolean;
    public classes: string;
    public isDataLoading: boolean;
    public onSelectCourt!: (selectedCourt: any) => any;
    public state!: string;

    declare public courts: any[];
    private isNoCourtsMessageVisible!: boolean;

    constructor(private $scope, private otrService) {
        this.inputClass = '';
        this.hasError = false;
        this.classes = this.inputClass;
        this.isDataLoading = false;
        this.findMatchingCourts = this.findMatchingCourts.bind(this);
    }

    declare private fuseAllKeys: any;
    declare private fuseCourtCode: any;

    public $onInit(): void {
        setTimeout(() => {
            const inputElement = document.querySelector('.app-courts input');
            const width = inputElement?.clientWidth;
            const height = inputElement?.clientHeight;
            const iconNode = document.querySelector('.app-courts .otr-dropdown__icon');
            if(width && height) {
                iconNode?.setAttribute('style',
                    'left: ' + (width - 30) + 'px; ' +
                    'top: ' + ((height / 2) - 6) + 'px');
            }
        });
    }

    public $onChanges(changes: any): void {
        if (changes.hasError) {
            this.classes = this.inputClass + (this.hasError
                ? " has-error"
                : "");
        }
        if (changes.state && this.state) {
            this.fetchCourts()
                .then((courts) => this.initFuse(angular.copy(courts)));
        }
    }

    private async fetchCourts(): Promise<any[]> {
        try {
            this.isDataLoading = true;
            let response = await this.otrService.findCourtsUsingGET({ state: this.state });
            this.courts = _.forEach(response.data.courts, (court) => {
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
            return this.courts;
        } finally {
            this.isDataLoading = false;
            this.$scope.$apply();
        }
    }

    private initFuse(courts: any[]): void {
        let fuseAllKeysOptions = {
            includeMatches: true,
            includeScore: true,
            distance: 2000,
            threshold: 0.5,
            keys: ['customTitle', 'customDescription']
        };
        try {
            this.fuseAllKeys = new Fuse(courts, fuseAllKeysOptions);
        } catch(error) {
            const additionalMessage = "Dependency fuse.js required";
            console.error(error, additionalMessage)
            throw error;
        }

        let fuseCourtCodeOptions = {
            includeMatches: true,
            includeScore: true,
            distance: 10,
            threshold: 0.1,
            keys: ['courtCode']
        }
        try {
            this.fuseCourtCode = new Fuse(courts, fuseCourtCodeOptions);
        } catch(error) {
            const additionalMessage = "Dependency fuse.js required";
            console.error(error, additionalMessage)
            throw error;
        }
    }

    public findMatchingCourts(query: string): any[] {

        const threshold = 600;
        let allKeysResults: any[] = _.sortBy(this.fuseAllKeys.search(query), 'courtId');
        let courtCodeResults: any[] = _.sortBy(this.fuseCourtCode.search(query), 'courtId');

        let results: any[] = _
            .chain(allKeysResults)
            .unionWith(courtCodeResults, (codeVal, allVal) => {
                let isEqual: boolean = codeVal.item.courtId === allVal.item.courtId;
                if (isEqual) {
                    allVal.score = _.min([codeVal.score, allVal.score])
                }
                return isEqual;
            })
            .sortBy('score')
            .take(threshold)
            .map((result) => {
                result.item.matches = result.matches;
                return result.item;
            })
            .value();

        return results;
    }
}

angular
    .module('otr-ui-shared-components')
    .component('appCourtsDropdown', {
        controller: CourtsDropdownCtrl,
        controllerAs: 'vm',
        templateUrl: '/components/courts-dropdown/courts-dropdown.component.html',
        bindings: {
            onSelectCourt: '&',
            inputClass: '@',
            hasError: '<',
            state: '@'
        }
    });

CourtsDropdownCtrl.$inject = ['$scope', 'otrService'];