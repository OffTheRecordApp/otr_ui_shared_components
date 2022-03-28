import angular from "angular";

interface StarRatingBindings {
  numberOfStars?: number;
  iconSize?: string;
  onChooseRating: ({ rating: number }) => null;
}

interface IStarRating extends StarRatingBindings {
  onClickRating: (index: number) => void;
  onHoverRating: (index: number) => void;
  onHoverRatingLeave: () => void;
}

class StarRating implements IStarRating {
  // Bindings
  numberOfStars?: number;
  iconSize?: string;
  onChooseRating!: ({ rating: number }) => null;

  // Interface
  currentRating = 0;
  currentRatingHover = 0;
  numberOfStarsArr: Array<number> = [];

  constructor() {
    this.iconSize = this.iconSize || "28px";
    this.numberOfStars = this.numberOfStars || 5;
    this.numberOfStarsArr = Array.from(Array(this.numberOfStars).keys());
  }

  public onClickRating(index: number) {
    this.currentRating = index + 1;
    this.currentRatingHover = 0;
    this.onChooseRating({ rating: this.currentRating });
  }

  public onHoverRating(index: number) {
    this.currentRatingHover = index + 1;
  }

  public onHoverRatingLeave() {
    this.currentRatingHover = 0;
  }
}

angular.module("otr-ui-shared-components").component("appStarRating", {
  templateUrl: "/components/star-rating/app-star-rating.component.html",
  bindings: {
    onChooseRating: "&",
    numberOfStars: "<?",
    iconSize: "@?",
  },
  controller: StarRating,
  controllerAs: "vm",
});
