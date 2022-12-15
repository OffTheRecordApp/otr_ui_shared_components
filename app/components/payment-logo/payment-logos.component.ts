import angular from 'angular';
import { PaymentService } from '../../services/payments.service';
import template from './payment-logos.component.html';

interface PaymentLogosBindings {
    title?: string;
}

type PaymentLogosObject = {
    key: string;
    logo: string;
    humanReadableKey: string;
};

class PaymentLogos implements PaymentLogosBindings {
    public title?: string;
    public availablePaymentLogos?: PaymentLogosObject[];

    constructor(private PaymentService: PaymentService) {}

    $onInit() {
        this.availablePaymentLogos = this.PaymentService.getPaymentLogos();
    }
}

const component = {
    selector: 'appPaymentLogos',
    template: template,
    bindings: {
        title: '@'
    },
    controller: PaymentLogos,
    controllerAs: 'vm'
};

angular.module('otr-ui-shared-components').component(component.selector, component);

PaymentLogos.$inject = ['PaymentService'];
