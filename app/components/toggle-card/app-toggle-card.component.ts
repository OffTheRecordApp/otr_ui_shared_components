import angular from 'angular';
import template from './app-toggle-card.component.html';

interface ToggleCardBindings {
    iconClass: string;
    cardTitle: string;
    tooltipPlacement?: string;
    tooltipMessage?: string;
    message?: string;
    isEnabled: boolean;
    onSwitchClick: () => null;
    isToggleLoading: boolean;
}

type Theme = 'success-green' | 'error-red';
type TooltipPlacements =
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'left-top'
    | 'left-bottom'
    | 'right-top'
    | 'right-bottom';

class ToggleCard implements ToggleCardBindings {
    // bindings
    iconClass!: string;
    cardTitle!: string;
    tooltipPlacement?: TooltipPlacements;
    tooltipMessage?: string;
    message?: string;
    isEnabled!: boolean;
    isToggleLoading!: boolean;
    onSwitchClick!: () => null;

    $onInit() {
        this.iconClass = this.iconClass || 'fa fa-solid fa-info';
        this.cardTitle = this.cardTitle || 'Card Title';
    }
}

const component = {
    selector: 'appToggleCard',
    template: template,
    bindings: {
        iconClass: '@',
        cardTitle: '<',
        tooltipPlacement: '@',
        tooltipMessage: '@',
        message: '@',
        isEnabled: '<',
        isToggleLoading: '<',
        onSwitchClick: '&'
    },
    controller: ToggleCard,
    controllerAs: 'vm'
};

angular.module('otr-ui-shared-components').component(component.selector, component);
