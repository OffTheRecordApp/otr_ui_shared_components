import angular from 'angular';
import template from './select-payment.component.html';
import { PaymentService } from '../../services/payments.service';
import {
    UserDomain,
    StripePaymentSourceDomain,
    StripeCardControllerApi
} from '@otr-app/shared-backend-generated-client/dist/typescript';
import { GlobalUtils } from '../../services/global-util.service';
import { filter, find, snakeCase } from 'lodash-es';

interface SelectPaymentBindings {
    onSelectPaymentMethod?: ({ paymentMethod }) => null;
    currentUser: UserDomain;
    onCardAddError: (error) => null;
}

type PaymentLogosObject = {
    key: string;
    logo: string;
    humanReadableKey: string;
};

class SelectPayment implements SelectPaymentBindings {
    //Binding
    public onSelectPaymentMethod!: ({ paymentMethod }) => null;
    public onCardAddError!: (error) => null;
    public currentUser!: UserDomain;

    // Interface
    public paymentTypes = ['card', 'gpay'];
    /* A payment type is 'card', 'gpay', etc. For now we only have 'card',
        but in the future we can use this to display different forms/info based on the
        payment type selected
    */
    public availablePaymentLogos!: PaymentLogosObject[];
    private selectedPaymentMethod!: StripePaymentSourceDomain | null | undefined;
    public isPaymentMethodsVisible!: boolean;
    public isAddCardFormVisible!: boolean;
    private paymentMethods!: StripePaymentSourceDomain[];
    public paymentErrorMessage?: string | null;
    public selectedPaymentType!: string;
    public isLoadingInitial!: boolean;

    constructor(
        private PaymentService: PaymentService,
        private $scope,
        private StripeCardControllerApi: StripeCardControllerApi,
        private GlobalUtils: GlobalUtils
    ) {}

    async $onInit() {
        this.availablePaymentLogos = this.PaymentService.getPaymentLogos();
        try {
            this.isLoadingInitial = true;
            await this.loadPaymentMethods(true);
        } finally {
            this.isLoadingInitial = false;
            this.$scope.$apply();
        }
    }

    private async loadPaymentMethods(isForcedRefresh?: boolean) {
        const params = isForcedRefresh
            ? {
                  params: { version: this.GlobalUtils.generateRandomString() }
              }
            : {};

        const { data } =
            await this.StripeCardControllerApi.getPaymentMethodsForUserUsingGET(
                // @ts-ignore
                this.currentUser.userId.toString(),
                params
            );

        this.paymentMethods = filter(data.paymentMethods, ['isExpired', false]);
        if (!this.paymentMethods?.length) {
            this.openNewCardForm();
        } else {
            this.selectedPaymentMethod = this.getPerferredPaymentMethod();
            this.onSelectPaymentMethod({ paymentMethod: this.selectedPaymentMethod });
            this.isAddCardFormVisible = false;
        }

        this.$scope.$apply();
        this.paymentErrorMessage = null;
    }

    public openNewCardForm() {
        // paymentTypes[0] is 'card'
        this.selectedPaymentType = this.paymentTypes[0];
        this.isAddCardFormVisible = true;
        this.isPaymentMethodsVisible = false;
        this.selectedPaymentMethod = null;
        this.paymentErrorMessage = null;
        this.onSelectPaymentMethod({ paymentMethod: this.selectedPaymentMethod });
    }

    private getPerferredPaymentMethod() {
        if (!this.paymentMethods) {
            return;
        }

        return find(this.paymentMethods, { isDefault: true });
    }

    selectPaymentMethod(cardId: string) {
        this.selectedPaymentMethod = find(this.paymentMethods, ['id', cardId]);
        this.isPaymentMethodsVisible = false;
        this.isAddCardFormVisible = false;
        this.paymentErrorMessage = null;

        this.onSelectPaymentMethod({ paymentMethod: this.selectedPaymentMethod });
    }

    getBrandLogo(brand) {
        const brandFormatted = snakeCase(brand);
        brand = this.availablePaymentLogos.find((a) => a.key === brandFormatted);
        return brand.logo;
    }

    public closePaymentMethodsOnBlur(e) {
        /*
            We want to close the payment selector on blur
            but only if the user isn't selecting an option
            or else the blur event will fire before an option is selected
        */
        if (!e?.relatedTarget?.classList?.contains('select__option')) {
            this.isPaymentMethodsVisible = false;
        }
    }

    public onCardAdd() {
        this.paymentErrorMessage = null;
        const forceRefresh = true;
        return this.loadPaymentMethods(forceRefresh);
    }

    public onAddCardError(error) {
        this.paymentErrorMessage = error;
        this.onCardAddError({ error: this.paymentErrorMessage });
    }
}

const component = {
    selector: 'appSelectPayment',
    template: template,
    bindings: {
        onSelectPaymentMethod: '&',
        currentUser: '<',
        onCardAddError: '&'
    },
    controller: SelectPayment,
    controllerAs: 'vm'
};

angular.module('otr-ui-shared-components').component(component.selector, component);

SelectPayment.$inject = [
    'PaymentService',
    '$scope',
    'StripeCardControllerApi',
    'GlobalUtils',
    '$http'
];
