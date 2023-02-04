import angular from "angular";
import template from './violations-dropdown.component.html';
import Fuse from "fuse.js";
import _ from "lodash";
import { TrafficViolationControllerApi } from "@otr-app/shared-backend-generated-client/dist/typescript";

interface ViolationsDropdownBindings {
    regionCode: string;
    onSelect: (violation: any) => any;
    inputClass: string
}

class ViolationsDropdownComponent implements ViolationsDropdownBindings {
    private violations: any;
    private fuseDescription: any;
    public regionCode: string = "";
    public onSelect = (violation: any) => console.log('onSelect binding not provided');
    public inputClass = "";
    public classes;
    private isDataLoading: boolean = false;

    constructor(private $scope, private trafficViolationControllerApi: TrafficViolationControllerApi) {
        this.filterViolationSearch = this.filterViolationSearch.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    async $onInit() {
        this.classes = this.inputClass;
        setTimeout(() => {
            const inputElement = document.querySelector('.app-violations input');
            const width = inputElement?.clientWidth;
            const height = inputElement?.clientHeight;
            const iconNode = document.querySelector('.app-violations .otr-dropdown__icon');
            if(width && height) {
                iconNode?.setAttribute('style',
                    'left: ' + (width - 30) + 'px; ' +
                    'top: ' + ((height / 2) - 6) + 'px');
            }
        });
        await this.fetchTrafficViolationTypes();
    }

    async $onChanges(changes) {
        if(changes.regionCode && this.regionCode) {
            await this.fetchTrafficViolationTypes();
        }
    }

    filterViolationSearch(query: string, violations: any[]) {
        const descriptionOptions = {
            includeMatches: true,
            includeScore: true,
            distance: 1000,
            keys: [
                {
                    name: 'trafficViolationDesc',
                    weight: 0.8
                },
                {
                    name: 'violationCode',
                    weight: 0.1
                },
                {
                    name: 'violationClassification',
                    weight: 0.1
                }
            ]
        };
        this.fuseDescription = new Fuse(violations, descriptionOptions);

        query = query.toLowerCase();

        const descriptionResults = this.fuseDescription.search(query);
        return _.chain(descriptionResults).map('item').value();
    }

    async fetchTrafficViolationTypes() {
        if(!this.regionCode) {
            console.warn("No region code provided");
            return;
        }

        try {
            this.isDataLoading = true;
            const response = await this.trafficViolationControllerApi
                .getTrafficViolationTypesUsingGET( 'CLIENT',
                    undefined,
                    undefined,
                   this.regionCode,
                );
            this.violations = response.data.violationTypes;
        } catch(error) {
            console.error('ERROR: ', error);
            throw error;
        } finally {
            this.isDataLoading = false;
            this.$scope.$apply();
        }
    }
}

angular.module('otr-ui-shared-components')
       .component('appViolationsDropdown', {
           template: template,
           controller: ViolationsDropdownComponent,
           controllerAs: 'vm',
           bindings: {
               regionCode: '<',
               inputClass: '@',
               onSelect: '<'
           }
        });

ViolationsDropdownComponent.$inject = ['$scope', 'TrafficViolationControllerApi'];