import angular from 'angular';
import _ from 'lodash';
import {
    UserProfileControllerApi,
    StripeCardControllerApi,
    AddressControllerApi,
    AddCardToStripeAccountRequest,
    UpdateUserPhoneNumberRequest
} from '@otr-app/shared-backend-generated-client/dist/typescript';

export class CreditCardService {
    constructor(
        private ENV,
        private $q,
        private stripe,
        private $log,
        private UserProfileControllerApi: UserProfileControllerApi,
        private StripeCardControllerApi: StripeCardControllerApi,
        private AddressControllerApi: AddressControllerApi
    ) {
        stripe.setPublishableKey(ENV.stripePublishableKey);
    }

    async addCardToUsersAccountLogic(
        params: any,
        makeDefault: boolean,
        caseId: string | null,
        userId: string
    ) {
        try {
            const response = await this.stripe.card.createToken(params);
            this.$log.debug('New Stripe token created: ', response);
            const request: AddCardToStripeAccountRequest = {
                sourceToken: response.id,
                makeDefault: !!makeDefault,
                userId: userId,
                caseId: caseId || null || undefined
            };
            return await this.StripeCardControllerApi.addCardToStripeAccountUsingPOST(
                request
            );
        } catch (error) {
            console.error('ERROR: Failed to create Stripe token: ', error);
            throw error;
        }
    }

    async saveUserPhoneNumber(phoneNumber, userId) {
        const request: UpdateUserPhoneNumberRequest = {
            phoneNumber: {
                phoneNumber: phoneNumber,
                // TODO: Figure out how to use enums from TS client
                type: <any>'MOBILE'
            }
        };

        try {
            await this.UserProfileControllerApi.addUserPhoneNumberUsingPOST(
                userId,
                request
            );
            return;
        } catch (error) {
            console.error('ERROR: Could not save phone number: ', error);
            throw error;
        }
    }

    isValidPhoneNumber(phoneNumberString) {
        if (phoneNumberString) {
            // remove all non-numeric characters from string
            phoneNumberString = phoneNumberString.replace(/\D/g, '');
            return phoneNumberString.length >= 10;
        }
        return false;
    }

    digestForm(form) {
        //This digest form is to fit Stripe's naming convention for API call.
        const creditCard: {
            address_zip: any;
            address_country: any;
            cvc: any;
            exp_month: any;
            exp_year: any;
            number: any;
        } = {
            address_zip: form.addressZip.$modelValue,
            address_country: form.addressCountry.$modelValue,
            cvc: form.ccCvc.$modelValue,
            exp_month: form.ccExpMonth.$modelValue,
            exp_year: form.ccExpYear.$modelValue,
            number: form.cardNumber.$modelValue
        };

        return creditCard;
    }

    paymentFormValidator(field) {
        const form = field.$$parentForm;

        // Fixes error in Safari where the credit card date validation overrides angular-validator
        if (
            (_.get(field, '$name') === 'ccExpYear' ||
                _.get(field, '$name') === 'ccExpMonth') &&
            field.$error.parse
        ) {
            field.$setValidity('parse', true);
        }

        if (form.$submitted === false) {
            return true;
        }
        if (!field.$viewValue) {
            return '&nbsp;Required';
        }

        // For US, zip code must be exactly 5 numbers
        if (
            field.$name === 'addressZip' &&
            form.addressCountry.$viewValue === 'US' &&
            (field.$viewValue.length !== 5 || !/^-?\d+$/.test(field.$viewValue))
        ) {
            return 'Please enter a valid 5-digit zip code';
        }

        switch (field.$name) {
            case 'phoneNumber':
                return field.$error.mask ? 'Invalid' : true;
            case 'addressZip':
                return field.$error.mask ? '&nbsp;Required' : true;
            case 'cardNumber':
                if (field.$error.ccNumberType) {
                    return 'Your card number is incorrect';
                } else if (
                    form.$error.ccExp ||
                    form.$error.ccExpYear ||
                    form.$error.ccExpMonth ||
                    !form.ccExpMonth.$viewValue ||
                    !form.ccExpYear.$viewValue
                ) {
                    return 'Invalid expiration date';
                } else {
                    return true;
                }
            case 'addressCountry':
                if (!field.$viewValue) {
                    field.$viewValue = 'US';
                }
            case 'ccCvc':
                return field.$error.ccCvc ? 'Invalid' : true;
            default:
                return true;
        }
    }

    handlePaymentProcessingError(error) {
        console.error('ERROR: An error occurred during case confirmation: ', error);
        const errorMessage = error?.data?.error?.uiErrorMsg || error?.message || error;
        return this.$q.reject(errorMessage);
    }

    async populateCountryField() {
        try {
            const response = await this.AddressControllerApi.getCountryListUsingGET();
            return response.data.countryList;
        } catch (error) {
            console.error('Failed to get country list: ', error);
            throw error;
        }
    }

    async populateStateField(countryCode: string) {
        try {
            const response = await this.AddressControllerApi.getCountryRegionsUsingGET(
                countryCode
            );
            return response.data.regions;
        } catch (error) {
            console.error('Failed to get region list: ', error);
            throw error;
        }
    }
}

angular
    .module('otr-ui-shared-components')
    .service('CreditCardService', CreditCardService);

CreditCardService.$inject = [
    'ENV',
    '$q',
    'stripe',
    '$log',
    'UserProfileControllerApi',
    'StripeCardControllerApi',
    'AddressControllerApi'
];
