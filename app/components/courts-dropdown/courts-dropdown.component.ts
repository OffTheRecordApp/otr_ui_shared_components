declare const Fuse: any;
let ctrl: any = null;

class CourtsDropdownComponent implements angular.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public templateUrl: string;

    constructor() {
        this.bindings = {
            onSelectCourt: '&',
            inputClass: '@',
            hasError: '<',
            courts: '<'
        };
        this.controller = CourtsDropdownCtrl;
        this.controllerAs = 'vm';
        this.templateUrl = '/components/courts-dropdown/courts-dropdown.component.html';
    }
}

interface ICourtsDropdownBindings {
    inputClass: string;
    hasError: boolean;
    onSelectCourt: (selectedCourt: any) => any;
    courts: any[];
}

interface ICourtsDropdownCtrl extends ICourtsDropdownBindings {
    classes: string;
    $onInit: () => void;
    $onChanges: (changes: any) => void;
    findMatchingCourts: (query: string) => any[];
}

class CourtsDropdownCtrl implements ICourtsDropdownCtrl {
    static $inject: string[] = [];
    public inputClass: string;
    public hasError: boolean;
    public onSelectCourt!: (selectedCourt: any) => any;
    public courts!: any[];
    public classes: string;
    public isCourtsLoading: boolean;

    constructor() {
        this.inputClass = '';
        this.hasError = false;
        this.classes = this.inputClass;
        this.isCourtsLoading = false;
    }

    declare private fuseAllKeys: any;
    declare private fuseCourtCode: any;

    $onInit(): void {
        ctrl = this;
    }

    $onChanges(changes: any): void {
        if (changes.hasError) {
            this.classes = this.inputClass + (this.hasError
                ? " has-error"
                : "");
        }
        if (changes.courts && this.courts) {
            this.initFuse(angular.copy(this.courts));
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
        } catch {
            throw "Dependency fuse.js required";
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
        } catch {
            throw "Dependency fuse.js required";
        }
    }

    public findMatchingCourts(query: string) {
        const threshold: number = 600;
        let allKeysResults: any[] = _.sortBy(ctrl.fuseAllKeys.search(query), 'courtId');
        let courtCodeResults: any[] = _.sortBy(ctrl.fuseCourtCode.search(query), 'courtId');

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
    .module('courtsDropdown', [])
    .component('courtsDropdown', new CourtsDropdownComponent());