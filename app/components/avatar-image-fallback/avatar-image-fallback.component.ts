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

    constructor(private $element) {}

    $onInit() {
        this.imageClass = this.avatarClass
            ? this.avatarClass
            : 'app-avatar-image-fallback__default';
        this.setCharCount();

        this.$element.find('img').bind('error', () => {
            const appColors = ['#007BE3', '#FFC715', '#00D6B2', '#FF4848', '#385064'];
            const defaultFallback = angular
                .element(document.createElement('i'))
                .addClass(
                    `fas fa-user app-avatar-image-fallback__default-user ${this.avatarClass}`
                )
                .css({
                    background: appColors[Math.floor(Math.random() * appColors.length)]
                });
            this.$element.parent().prepend(defaultFallback);
            this.$element.remove();
        });
    }

    setCharCount() {
        if (this.name) {
            this.charCount = this.name.includes(' ') ? 2 : 1;
        }
    }
}

angular.module('otr-ui-shared-components').component('avatarImageFallback', {
    templateUrl:
        'app/components/avatar-image-fallback/avatar-image-fallback.component.html',
    controller: AvatarImageFallback,
    bindings: {
        src: '<',
        avatarClass: '@',
        name: '@'
    },
    controllerAs: 'vm'
});

AvatarImageFallback.$inject = ['$element'];
