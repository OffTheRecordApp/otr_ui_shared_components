import angular from "angular";

interface StatCardBindings {
    borderColor: string;
    borderColorSelected: string;
    titleColor: string;
    iconClass: string;
    cardTitle: string;
    onSelectedShowMe: () => null
    statNumberToDisplay: string;
    statNumberLoading: boolean;
    isSelected: boolean;
}

class StatCard implements StatCardBindings {
    //bindings
    borderColor!: string;
    borderColorSelected!: string;
    titleColor!: string;
    iconClass!: string;
    cardTitle!: string;
    onSelectedShowMe!: () => null;
    statNumberToDisplay!: string;
    statNumberLoading!: boolean;
    isSelected!: boolean;

    constructor() {
        this.borderColor = this.borderColor || "border-fusion-yellow";
        this.borderColorSelected = this.borderColorSelected || "border-fusion-yellow--selected";
        this.titleColor = this.titleColor || "text-fusion-yellow";
        this.iconClass = this.iconClass || "fa fa-users";
        this.cardTitle = this.cardTitle || "Card title";
        this.statNumberToDisplay = this.statNumberToDisplay || "10";
    }
}

const component = {
    selector: "appStatCard",
    templateUrl: "/components/stat-card/app-stat-card.component.html",
    bindings: {
        borderColor: '@',
        borderColorSelected: '@',
        titleColor: '@',
        iconClass: '@',
        cardTitle: '@',
        onSelectShowMe: '&',
        statNumberToDisplay: '@',
        statNumberLoading: '<',
        isSelected: '<'
    },
    controller: StatCard,
    controllerAs: 'vm'
}

angular.module("otr-ui-shared-components").component(component.selector, component);
