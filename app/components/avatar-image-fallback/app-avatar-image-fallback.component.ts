import angular from 'angular';

interface AvatarImageFallbackBindings {
    src?: string;
    avatarClass?: string;
    name?: string;
    size?: number;
    fontSize?: number;
}

class AppAvatarImageFallback implements AvatarImageFallbackBindings {
    // bindings
    src?: string;
    avatarClass?: string;
    name?: string;
    size?: number;
    fontSize?: number;

    // interface
    imageClass!: string;
    charCount!: number;
    isLetterAvatarVisible!: boolean;
    stringSize!: string;

    constructor(private $element, private $scope) {}

    $onInit() {
        this.imageClass = this.avatarClass
            ? this.avatarClass
            : 'app-avatar-image-fallback__default';
        this.size = this.size || 62;
        this.fontSize = this.fontSize || 30;

        // convert to string for ng-style
        this.stringSize = this.size.toString() + 'px';

        this.setCharCount();
        this.setLetterProfileAvatar();
    }

    //sets ngLetterAvatar character count; max 2 characters
    setCharCount() {
        const spacePattern = /\s+/;
        if (this.name) {
            this.charCount = spacePattern.test(this.name) ? 2 : 1;
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
                    background: appColors[Math.floor(Math.random() * appColors.length)],
                    height: this.stringSize,
                    width: this.stringSize
                });
            this.$element.parent().prepend(defaultFallback);
            this.$element.remove();
        } else {
            this.$element.find('img').bind('error', () => {
                this.$element[0].children[0].remove();
                this.isLetterAvatarVisible = true;
                this.$scope.$apply();
            });
        }
    }
}

angular.module('otr-ui-shared-components').component('appAvatarImageFallback', {
    templateUrl:
        '/components/avatar-image-fallback/app-avatar-image-fallback.component.html',
    controller: AppAvatarImageFallback,
    bindings: {
        src: '<',
        avatarClass: '@',
        name: '@',
        size: '<',
        fontSize: '<'
    },
    controllerAs: 'vm'
});

AppAvatarImageFallback.$inject = ['$element', '$scope'];
