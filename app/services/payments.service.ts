import angular from 'angular';
import Visa from '../assets/img/logos/payment-logo-visa.webp';
import MasterCard from '../assets/img/logos/payment-logo-master_card.svg';
import Discover from '../assets/img/logos/payment-logo-discover.webp';
import AM from '../assets/img/logos/payment-logo-american_express.svg';
import Diners from '../assets/img/logos/payment-logo-diners_club.webp';
import JCB from '../assets/img/logos/payment-logo-jcb.webp';
import Union from '../assets/img/logos/payment-logo-union_pay.webp';

export class PaymentService {
    public availablePaymentLogos = [
        {
            key: 'visa',
            logo: Visa,
            humanReadableKey: 'Visa'
        },
        {
            key: 'master_card',
            logo: MasterCard,
            humanReadableKey: 'Master Card'
        },
        {
            key: 'discover',
            logo: Discover,
            humanReadableKey: 'Discover'
        },
        {
            key: 'american_express',
            logo: AM,
            humanReadableKey: 'American Express'
        },
        {
            key: 'diners_club',
            logo: Diners,
            humanReadableKey: `Diner's Club`
        },
        {
            key: 'jcb',
            logo: JCB,
            humanReadableKey: 'JCB'
        },
        {
            key: 'union_pay',
            logo: Union,
            humanReadableKey: 'Union Pay'
        }
    ];

    public getPaymentLogos() {
        return this.availablePaymentLogos;
    }
}

angular.module('otr-ui-shared-components').service('PaymentService', PaymentService);

PaymentService.$inject = [];
