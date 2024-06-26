import angular from 'angular';
import template from './courts-dropdown.component.html';
import { forEach, sortBy, min, chain } from "lodash-es";
import { CourtControllerApi, GetCourtsInnerResponse } from "@otr-app/shared-backend-generated-client/dist/typescript";

declare const Fuse: any;
type GetCourtsModel = (GetCourtsInnerResponse & {
    customTitle?: string,
    customDescription?: string})[];

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

    declare public courts: GetCourtsModel;

    private isNoCourtsMessageVisible!: boolean;

    constructor(private $scope, private courtControllerApi: CourtControllerApi) {
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
            const { data } = await this.courtControllerApi.findCourtsUsingGET(undefined,
                undefined, undefined, undefined, undefined, undefined,
                undefined,
                undefined,
                // @ts-ignore
                this.state);
            this.courts = forEach(data.courts as GetCourtsModel, (court) => {
                court.customTitle = court.courtName;
                court.customTitle += court.courtNameAdditional
                    ? ' – ' + court.courtNameAdditional
                    : '';
                court.customTitle += court.courtCode
                    ? ' (' + court.courtCode + ')'
                    : '';
                court.customDescription = court.address?.city + ', '
                    + court.address?.regionCode + ' '
                    + court.address?.postalCode + ' – '
                    + court.address?.countyName + ' County';
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
        let allKeysResults: any[] = sortBy(this.fuseAllKeys.search(query), 'courtId');
        let courtCodeResults: any[] = sortBy(this.fuseCourtCode.search(query), 'courtId');

        let results: any[] = chain(allKeysResults)
            .unionWith(courtCodeResults, (codeVal, allVal) => {
                let isEqual: boolean = codeVal.item.courtId === allVal.item.courtId;
                if (isEqual) {
                    allVal.score = min([codeVal.score, allVal.score])
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
        template: template,
        bindings: {
            onSelectCourt: '&',
            inputClass: '@',
            hasError: '<',
            state: '<'
        }
    });

CourtsDropdownCtrl.$inject = ['$scope', 'CourtControllerApi'];
