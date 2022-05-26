import angular from 'angular';

interface ToggleCardBindings {
    iconClass: string;
    cardTitle: string;
    tooltipDirection: string | undefined;
    tooltipMessage: string | undefined;
    message: string | undefined;
    isToggled: boolean;
    updateToggle: () => null;
    isToggleLoading: boolean;
}

type Theme = 'success-green' | 'error-red';

class ToggleCard implements ToggleCardBindings {
    // bindings
    iconClass!: string;
    cardTitle!: string;
    tooltipDirection: string | undefined;
    tooltipMessage: string | undefined;
    message: string | undefined;
    isToggled!: boolean;
    isToggleLoading!: boolean;
    updateToggle!: () => null;

    $onInit() {
        this.iconClass = this.iconClass || 'fa fa-solid fa-info';
        this.cardTitle = this.cardTitle || 'Card Title';
        this.isToggled = this.isToggled;
        this.isToggleLoading = this.isToggleLoading;
    }
}

const component = {
    selector: 'appToggleCard',
    templateUrl: '/components/toggle-card/app-toggle-card.component.html',
    bindings: {
        iconClass: '@',
        cardTitle: '<',
        tooltipDirection: '@',
        tooltipMessage: '<',
        message: '<',
        isToggled: '<',
        isToggleLoading: '<',
        updateToggle: '&'
    },
    controller: ToggleCard,
    controllerAs: 'vm'
};

angular.module('otr-ui-shared-components').component(component.selector, component);
