import angular from 'angular';
import _ from 'lodash';
import template from './credit-card-form.component.html';
import { CreditCardService } from '../../services/credit-card.service';
import { FlashService } from '../../services/flash.service';

interface CreditCardFormBindings {
    onCardAdd: () => null;
    onError: (error) => null;
    currentUser: any;
}

class CreditCardFormComponent implements CreditCardFormBindings {
    onCardAdd!: () => null;
    onError!: (error) => null;
    currentUser!: any;

    constructor(
        private CreditCardService: CreditCardService,
        private FlashService: FlashService,
        private $scope
    ) {}

    public baseCardSettings? = { address_country: 'US' };

    // variables
    public newCard: { address_country?: string; phoneNumber?: number } = {
        ...this.baseCardSettings
    };
    countries?: any[];
    showLoading = false;
    paymentErrorMessage: any;

    $onInit() {
        this.populateCountriesForCC();
    }

    confirmAddCard(form) {
        _.get(this.newCard, 'phoneNumber') &&
            this.CreditCardService.saveUserPhoneNumber(
                this.newCard.phoneNumber,
                this.currentUser.userId.toString()
            );
        this.addNewCardLogic(this.CreditCardService.digestForm(form));
    }

    paymentFormValidator(field) {
        return this.CreditCardService.paymentFormValidator(field);
    }

    async addNewCardLogic(params) {
        const makeDefault = true;
        this.paymentErrorMessage = null;
        this.showLoading = true;

        try {
            await this.CreditCardService.addCardToUsersAccountLogic(
                params,
                makeDefault,
                null,
                this.currentUser.userId.toString()
            );

            await this.onCardAdd();
            this.newCard = { ...this.baseCardSettings };
            this.showLoading = false;
            this.$scope.creditCardForm.$setPristine();
        } catch (error) {
            try {
                await this.CreditCardService.handlePaymentProcessingError(error);
            } catch (error: any) {
                this.showLoading = false;
                this.paymentErrorMessage = error;
                this.FlashService.Error(error);
                this.onError({ error: error });
            } finally {
                this.$scope.$apply();
            }
        } finally {
            this.$scope.$apply();
        }
    }

    async populateCountriesForCC() {
        try {
            const response = await this.CreditCardService.populateCountryField();
            this.countries = response;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            this.$scope.$apply();
        }
    }
}

const component = {
    selector: 'appCreditCardForm',
    template: template,
    bindings: {
        onCardAdd: '&',
        currentUser: '<',
        onError: '&'
    },
    controller: CreditCardFormComponent,
    controllerAs: 'vm'
};

angular.module('otr-ui-shared-components').component(component.selector, component);

CreditCardFormComponent.$inject = ['CreditCardService', 'FlashService', '$scope'];
