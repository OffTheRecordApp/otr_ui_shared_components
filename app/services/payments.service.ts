import angular from 'angular';

export class PaymentService {
    public availablePaymentLogos = [
        {
            key: 'visa',
            logo: 'assets/img/logos/payment-logo-visa.png',
            humanReadableKey: 'Visa'
        },
        {
            key: 'master_card',
            logo: 'assets/img/logos/payment-logo-master_card.svg',
            humanReadableKey: 'Master Card'
        },
        {
            key: 'discover',
            logo: 'assets/img/logos/payment-logo-discover.jpg',
            humanReadableKey: 'Discover'
        },
        {
            key: 'american_express',
            logo: 'assets/img/logos/payment-logo-american_express.svg',
            humanReadableKey: 'American Express'
        },
        {
            key: 'diners_club',
            logo: 'assets/img/logos/payment-logo-diners_club.jpg',
            humanReadableKey: `Diner's Club`
        },
        {
            key: 'jcb',
            logo: 'assets/img/logos/payment-logo-jcb.jpg',
            humanReadableKey: 'JCB'
        },
        {
            key: 'union_pay',
            logo: 'assets/img/logos/payment-logo-union_pay.jpg',
            humanReadableKey: 'Union Pay'
        }
    ];

    public getPaymentLogos() {
        return this.availablePaymentLogos;
    }
}

angular.module('otr-ui-shared-components').service('PaymentService', PaymentService);

PaymentService.$inject = [];
