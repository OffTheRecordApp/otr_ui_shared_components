import angular from 'angular';

interface ToggleCardBindings {
    iconClass: string;
    cardTitle: string;
    tooltipPlacement: TooltipPlacements | undefined;
    tooltipMessage: string | undefined;
    message: string | undefined;
    isToggled: boolean;
    updateToggle: () => null;
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
    tooltipPlacement: TooltipPlacements | undefined;
    tooltipMessage: string | undefined;
    message: string | undefined;
    isToggled!: boolean;
    isToggleLoading!: boolean;
    updateToggle!: () => null;

    $onInit() {
        this.iconClass = this.iconClass || 'fa fa-solid fa-info';
        this.cardTitle = this.cardTitle || 'Card Title';
    }
}

const component = {
    selector: 'appToggleCard',
    templateUrl: '/components/toggle-card/app-toggle-card.component.html',
    bindings: {
        iconClass: '@',
        cardTitle: '<',
        tooltipPlacement: '@',
        tooltipMessage: '@',
        message: '@',
        isToggled: '<',
        isToggleLoading: '<',
        updateToggle: '&'
    },
    controller: ToggleCard,
    controllerAs: 'vm'
};

angular.module('otr-ui-shared-components').component(component.selector, component);
