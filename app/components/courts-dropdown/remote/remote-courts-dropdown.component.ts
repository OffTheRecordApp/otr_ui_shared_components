import angular from 'angular';
import template from './remote-courts-dropdown.component.html';
import { forEach } from 'lodash-es';
import { CourtControllerApi } from '@otr-app/shared-backend-generated-client/dist/typescript';

interface RemoteCourtsDropdownBindings {
    inputClass: string;
    hasError: boolean;
    onSelectCourt: (selectedCourt: any, index?: number) => any;
    state: string;
    citationId: number;
    index: number;
    placeholder: string;
}

class RemoteCourtsDropdownComponent implements RemoteCourtsDropdownBindings {
    inputClass: string = '';
    hasError: boolean = false;
    onSelectCourt: (selectedCourt: any, index?: number) => any = (court, index) => null;
    state: string = '';
    citationId;
    index;
    placeholder: string = '';

    private isNoCourtsMessageVisible = false;
    private isDataLoading = false;

    constructor(
        private $scope,
        private courtControllerApi: CourtControllerApi
    ) {
        this.selectCourt = this.selectCourt.bind(this);
        this.findMatchingCourts = this.findMatchingCourts.bind(this);
        this.formatMatchingCourtsResponse = this.formatMatchingCourtsResponse.bind(this);
    }

    async findMatchingCourts(query: string): Promise<any> {
        const params = {
            q: query,
            state: this.state,
            citationId: this.citationId
        };

        try {
            this.setSpinnerPosition();
            this.isDataLoading = true;
            const response = await this.courtControllerApi.searchCourtsUsingGET(
                this.citationId,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                query,
                undefined,
                // @ts-ignore
                this.state
            );
            this.isNoCourtsMessageVisible = !response.data.numRecords;
            return response.data;
        } finally {
            this.isDataLoading = false;
        }
    }

    formatMatchingCourtsResponse(response) {
        forEach(response.courts, (elem) => {
            elem.title = `${elem.courtName} (${elem.courtId})`;
            elem.customDescription = `${elem.address.city}, ${elem.address.region.regionCode} - ${elem.countyObj.countyName} County`;
        });
        setTimeout(() => this.$scope.$apply(), 0);
        return response;
    }

    setSpinnerPosition() {
        const inputElement = document.querySelector('.app-remote-courts input');
        const width = inputElement?.clientWidth;
        const height = inputElement?.clientHeight;
        const iconNode = document.querySelector('.app-remote-courts .otr-dropdown__icon');
        if (width && height) {
            iconNode?.setAttribute(
                'style',
                'left: ' + (width - 30) + 'px; ' + 'top: ' + (height / 2 - 6) + 'px'
            );
        }
    }

    selectCourt(court) {
        this.onSelectCourt(court, this.index);
    }
}

angular.module('otr-ui-shared-components').component('appRemoteCourtsDropdown', {
    template: template,
    controller: RemoteCourtsDropdownComponent,
    controllerAs: 'vm',
    bindings: {
        state: '@',
        citationId: '@',
        placeholder: '@',
        onSelectCourt: '<',
        index: '@',
        inputClass: '@',
        hasError: '<'
    }
});

RemoteCourtsDropdownComponent.$inject = ['$scope', 'CourtControllerApi'];
