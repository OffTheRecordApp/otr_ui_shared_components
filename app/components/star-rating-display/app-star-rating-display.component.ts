import angular from 'angular';
import template from './app-star-rating-display.component.html';

interface StarRatingDisplay {
    color?: string;
    rating: number;
}

class StarRatingDisplay implements StarRatingDisplay {
    // Bindings
    color?: string;
    rating!: number;

    // Interface
    percentage!: string;
    customColor!: string;

    // Variables
    VISIBLE_STAR_PCT = 10;
    INITIAL_STAR_OFFSET = 4;

    $onInit() {
        const wholeStars = Math.floor(this.rating);
        const wholeStarsPercentage = wholeStars * 20;
        const decimalStarPercentage =
            (this.rating - wholeStars) *
            (this.VISIBLE_STAR_PCT + this.INITIAL_STAR_OFFSET);
        this.percentage = wholeStarsPercentage + decimalStarPercentage + '%';
        this.customColor = this.color || '#ffc715';
    }

}

const component = {
    selector: 'appStarRatingDisplay',
    template: template,
    bindings: {
        color: '@',
        rating: '<'
    },
    controller: StarRatingDisplay,
    controllerAs: 'vm'
};

angular.module('otr-ui-shared-components').component(component.selector, component);
