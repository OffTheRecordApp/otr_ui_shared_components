import angular from "angular";

interface StatCardBindings {
    theme: string | undefined
    color: string | undefined
    iconClass: string;
    cardTitle: string;
    onSelectedShowMe: () => null
    statNumberToDisplay: string;
    statNumberLoading: boolean;
    isSelected: boolean;

}

class StatCard implements StatCardBindings {
    //bindings
    theme!: string | undefined;
    color!: string | undefined;
    iconClass!: string;
    cardTitle!: string;
    onSelectedShowMe!: () => null;
    statNumberToDisplay!: string;
    statNumberLoading!: boolean;
    isSelected!: boolean;

    $onInit() {
        this.color = this.color || undefined
        this.theme = this.color ? undefined : this.theme || "default"
        this.iconClass = this.iconClass || "fa fa-users";
        this.cardTitle = this.cardTitle || "Card title";
        this.statNumberToDisplay = this.statNumberToDisplay || "10";
        this.isSelected = this.isSelected;
    }

    enumThemesCheck(theme) {
        const themeEnums = ['fusion-yellow', 'fusion-teal', 'fusion-red', 'fusion-purple'];
        if (this.isSelected) {
            return themeEnums.includes(theme) ? theme + "--selected" : "default--selected";
        } else {
            return themeEnums.includes(theme) ? theme : "default";
        }
    }

    // color can be either HEX or RGBA (ex. rgb(0, 0, 0))
    applyCustomColor(color) {
        if (this.isSelected) {
            return {"color": color, "border": "1px solid " + color, "border-left": "4px solid " + color}
        } else {
            return {"color": color, "border-left": "4px solid " + color}
        }
    }
}

const component = {
    selector: "appStatCard",
    templateUrl: "/components/stat-card/app-stat-card.component.html",
    bindings: {
        theme: '@',
        color: '@',
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
