import angular from 'angular';
import template from './app-button-card.component.html';

interface ButtonCardBindings {
    theme?: string;
    color?: string;
    iconClass: string;
    cardTitle: string;
    onSelect: () => null;
    statInfoToDisplay: string;
    isSelected: boolean;
    isIconShowing: boolean;
    isRouting: boolean | null;
    route?: string | null;
    onButtonClick?: () => null;
    buttonText?: string;
    cardMessage?: string;
    isButtonVisible: boolean;
    tooltipPlacement?: string;
    tooltipMessage?: string;
    tooltipVisible: boolean;
}

type Theme = 'fusion-yellow' | 'fusion-teal' | 'fusion-red' | 'fusion-purple' | 'default';

class ButtonCard implements ButtonCardBindings {
    // card bindings
    theme?: Theme;
    color?: string;
    iconClass!: string;
    cardTitle!: string;
    onSelect!: () => null;
    statInfoToDisplay!: string;
    isSelected!: boolean;
    isIconShowing!: boolean;
    isRouting!: boolean | null;
    onButtonClick?: () => null;
    route?: string | null;
    buttonText?: string;
    cardMessage?: string;
    isButtonVisible!: boolean;

    // tooltip bindings
    tooltipPlacement?: string;
    tooltipMessage?: string;
    tooltipVisible!: boolean;

    $onInit() {
        this.color = this.color ?? undefined;
        this.theme = this.color ? undefined : this.theme ?? 'default';
        this.iconClass = this.iconClass ?? 'fa fa-solid fa-info';
        this.cardTitle = this.cardTitle ?? 'Card title';
        this.statInfoToDisplay = this.statInfoToDisplay ?? '10';
        this.isRouting = this.isRouting ?? null;
        this.route = this.route ?? null;
    }

    applyThemeClass() {
        const themeEnums: Theme[] = [
            'fusion-yellow',
            'fusion-teal',
            'fusion-red',
            'fusion-purple'
        ];
        if (this.theme && themeEnums.includes(this.theme)) {
            if (!this.isButtonVisible) {
                return this.isSelected
                    ? `${this.theme} ${this.theme}--selected clickable`
                    : `${this.theme} clickable`;
            }
            return this.isSelected ? `${this.theme} ${this.theme}--selected` : this.theme;
        } else {
            if (!this.isButtonVisible) {
                return this.isSelected
                    ? 'default default--selected clickable'
                    : 'default clickable';
            }
            return this.isSelected ? 'default default--selected' : 'default';
        }
    }

    // color can be either HEX, RGBA (ex. rgb(0, 0, 0)), color names like yellow
    applyCustomColor() {
        if (this.color) {
            return this.isSelected
                ? { color: this.color, 'border-color': this.color }
                : { color: this.color, 'border-left-color': this.color };
        }
    }

    applyButtonClass() {
        if (this.theme) {
            return 'otr-button--' + this.theme;
        }

        if (this.color && !this.theme) {
            return 'otr-button--dynamic';
        }
    }

    applyButtonColor() {
        if (this.color) {
            return {
                background: this.color,
                color: '#fff'
            };
        }
    }
}

const component = {
    selector: 'appButtonCard',
    template: template,
    bindings: {
        theme: '@',
        color: '@',
        iconClass: '@',
        cardTitle: '@',
        onSelect: '&',
        statInfoToDisplay: '@',
        isSelected: '<',
        isIconShowing: '<',
        isRouting: '<',
        onButtonClick: '&',
        route: '@',
        buttonText: '@',
        isButtonVisible: '<',
        cardMessage: '@',
        tooltipPlacement: '@',
        tooltipMessage: '@',
        tooltipVisible: '<'
    },
    controller: ButtonCard,
    controllerAs: 'vm'
};

angular.module('otr-ui-shared-components').component(component.selector, component);

ButtonCard.$inject = [];
