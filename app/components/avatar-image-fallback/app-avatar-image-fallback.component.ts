import angular from 'angular';

interface AvatarImageFallbackBindings {
    src?: string;
    avatarClass?: string;
    name?: string;
}

class AvatarImageFallback implements AvatarImageFallbackBindings {
    // bindings
    src?: string;
    avatarClass?: string;
    name?: string;

    // interface
    imageClass!: string;
    charCount!: number;
    isLetterAvatarShowing!: boolean;

    constructor(private $element, private $scope) {}

    $onInit() {
        this.imageClass = this.avatarClass
            ? this.avatarClass
            : 'app-avatar-image-fallback__default';

        this.setCharCount();
        this.setLetterProfileAvatar();
    }

    //sets ngLetterAvatar character count; max 2 characters
    setCharCount() {
        const regex = /\s+/;
        if (this.name) {
            this.charCount = regex.test(this.name) ? 2 : 1;
        }
    }

    setLetterProfileAvatar() {
        // Use case: when user does not have profile image or name
        if (!this.src && !this.name) {
            const appColors = ['#007BE3', '#FFC715', '#00D6B2', '#FF4848', '#385064'];
            const defaultFallback = angular
                .element(document.createElement('i'))
                .addClass('fas fa-user app-avatar-image-fallback__default-user')
                .css({
                    background: appColors[Math.floor(Math.random() * appColors.length)]
                });
            this.$element.parent().prepend(defaultFallback);
            this.$element.remove();
        } else {
            this.$element.find('img').bind('error', () => {
                this.$element[0].children[0].remove();
                this.isLetterAvatarShowing = true;
                this.$scope.$apply();
            });
        }
    }
}

angular.module('otr-ui-shared-components').component('appAvatarImageFallback', {
    templateUrl:
        'app/components/avatar-image-fallback/app-avatar-image-fallback.component.html',
    controller: AvatarImageFallback,
    bindings: {
        src: '<',
        avatarClass: '@',
        name: '@'
    },
    controllerAs: 'vm'
});

AvatarImageFallback.$inject = ['$element', '$scope'];
