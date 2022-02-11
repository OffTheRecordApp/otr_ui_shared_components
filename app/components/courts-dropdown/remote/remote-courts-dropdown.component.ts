interface RemoteCourtsDropdownBindings {
    inputClass: string;
    hasError: boolean;
    onSelectCourt: (selectedCourt: any) => any;
    state: string;
    citationId: number;
    index: number;
    placeholder: string;
}

class RemoteCourtsDropdownComponent implements RemoteCourtsDropdownBindings {
    inputClass: string = "";
    hasError: boolean = false;
    onSelectCourt: (selectedCourt: any) => any = (court) => null;
    state: string = "";
    citationId;
    index;
    placeholder: string = "";

    private isNoCourtsMessageVisible = false;
    private isDataLoading = false;

    constructor(private $scope, private $timeout, private otrService) {
        this.findMatchingCourts = this.findMatchingCourts.bind(this);
        this.formatMatchingCourtsResponse = this.formatMatchingCourtsResponse.bind(this);
    }

    $onInit() {
        this.$timeout(() => {
            const width = document.querySelector('.app-remote-courts input')?.clientWidth;
            const iconNode = document.querySelector('.app-remote-courts .otr-dropdown__icon');
            if(width) {
                iconNode?.setAttribute('style', 'left: ' + (width - 30) + 'px');
            }
        }, 1000);
    }

    async findMatchingCourts(query: string): Promise<any[]> {
        const params = {
            q: query,
            state: this.state,
            citationId: this.citationId
        };

        try {

            this.isDataLoading = true;
            const response = await this.otrService.searchCourtsUsingGET(params);
            this.isNoCourtsMessageVisible = !response.data.numRecord;
            return response;
        } finally {
            this.isDataLoading = false;
        }
    }

    formatMatchingCourtsResponse(response) {
        _.forEach(response.courts,  (elem) => {
            elem.title = `${elem.courtName} (${elem.courtId})`
            elem.customDescription = `${elem.address.city}, ${elem.address.region.regionCode} - ${elem.countyObj.countyName} County`;
        });
        setTimeout(() => this.$scope.$apply(), 0);
        return response;
    }
}

angular.module('otr-ui-shared-components')
       .component('appRemoteCourtsDropdown', {
           templateUrl: '/components/courts-dropdown/remote/remote-courts-dropdown.component.html',
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

RemoteCourtsDropdownComponent.$inject = ['$scope', '$timeout', 'otrService'];
