import angular from 'angular';
import courtTemplate from './courts.html';
import otrSearchTemplate from '../../otr-search-template.html';
import violationsTemplate from './violations.html';
import starRatingTemplate from './star-rating.html';
import statCardsTemplate from './stat-cards.html';
import toggleCardsTemplate from './toggle-cards.html';
import avatarFallbackTemplate from './avatars.html';
import paymentLogosTemplate from './payment-logos.html';
import buttonCardTemplate from './button-card.html';
import multiSelectDropdownTemplate from './multi-select-dropdown.html';

angular
    .module('otr-ui-shared-components')
    .run([
        '$rootScope',
        '$templateCache',
        ($rootScope, $templateCache) => {
            $templateCache.put('/otr-search-template.html', otrSearchTemplate);
            $rootScope.flash = {};
        }
    ])
    .config([
        '$stateProvider',
        'basePathProvider',
        '$httpProvider',
        function ($stateProvider, basePathProvider, $httpProvider) {
            $httpProvider.defaults.withCredentials = true;

            basePathProvider.setDomain(
                'https://otr-backend-service-us-devo.offtherecord.com'
            );

            $stateProvider
                .state('courts', {
                    url: '/courts',
                    views: {
                        '': {
                            template: courtTemplate,
                            controllerAs: 'vm',
                            controller: function () {
                                let vm: any = this;
                                vm.regionCode = 'WA';
                                vm.onSelect = (c) => {
                                    console.log('Selected court', c);
                                };
                            }
                        }
                    }
                })
                .state('violations', {
                    url: '/violations',
                    views: {
                        '': {
                            template: violationsTemplate,
                            controllerAs: 'vm',
                            controller: function () {
                                let vm: any = this;
                                vm.regionCode = 'WA';
                                vm.onSelect = (c) => {
                                    console.log('Selected violation', c);
                                };
                            }
                        }
                    }
                })
                .state('star-rating', {
                    url: './stars',
                    views: {
                        '': {
                            template: starRatingTemplate,
                            controller: function () {
                                let vm: any = this;
                                vm.onChooseRating = (r) => {
                                    console.log('Rating chosen: ', r.rating);
                                };
                            }
                        }
                    }
                })
                .state('stat-cards', {
                    url: '/stat-cards',
                    views: {
                        '': {
                            template: statCardsTemplate,
                            controllerAs: 'vm',
                            controller: function () {
                                let vm: any = this;
                                vm.isIconShowing = true;
                                // variables for stat card
                                vm.userNum = '20';
                                vm.statusToFilterOn = 'cases_pending';

                                vm.toggleIcons = () => {
                                    vm.isIconShowing = !vm.isIconShowing;
                                };

                                vm.updateDashboardCases = (d) => {
                                    vm.statusToFilterOn = d;
                                    console.log('Selected cases filter:', d);
                                };

                                vm.resetSelectedFilter = () => {
                                    console.log('status is ', vm.statusToFilterOn);
                                    vm.statusToFilterOn = '';
                                };
                            }
                        }
                    }
                })
                .state('toggle-cards', {
                    url: '/toggle-cards',
                    views: {
                        '': {
                            template: toggleCardsTemplate,
                            controllerAs: 'vm',
                            controller: function ($timeout) {
                                let vm: any = this;
                                // variables for toggle card
                                vm.message = 'You are NOT accepting cases';
                                vm.uibMessage =
                                    'Accepting Cases is turned off for your law firm. You will not receive any new cases. If you wish to resume receiving cases, you can click the toggle switch to start receiving cases again at any time.';
                                vm.title = 'Not accepting cases';
                                vm.vacationModeUpdating = false;
                                vm.isVacationMode = true;

                                vm.updateVacationMode = () => {
                                    vm.isVacationMode = !vm.isVacationMode;
                                };

                                vm.changeMessage = () => {
                                    vm.vacationModeUpdating = true;

                                    $timeout(() => {
                                        vm.vacationModeUpdating = false;
                                        vm.isVacationMode = !vm.isVacationMode;
                                        vm.message = 'You are accepting cases';
                                        vm.uibMessage =
                                            'Accepting Cases is turned on for your law firm. You will receive new cases to review as they are booked. If you need a break or are on vacation, you can click the toggle switch to pause receiving cases at any time.';
                                        vm.title = 'Accepting cases';
                                    }, 500);
                                };
                            }
                        }
                    }
                })
                .state('avatars', {
                    url: '/avatars',
                    views: {
                        '': {
                            template: avatarFallbackTemplate,
                            controllerAs: 'vm',
                            controller: function () {
                                let vm: any = this;
                                vm.profileImageUrl =
                                    'https://graph.facebook.com/v2.8/3668555106576865/picture?height=961';
                                vm.name = 'James Smith';
                                vm.avatarClass = 'customer';
                                vm.brokenProfileImage =
                                    'https://s3.amazonaws.com/otr-assets/img/icons/jkfkl;jdaf';
                                vm.facebookProfilePicture =
                                    'https://graph.facebook.com/v2.5/10155312614059658/picture?height=961';
                                vm.undefinedName = undefined;
                                vm.size = 72;
                            }
                        }
                    }
                })
                .state('payment-logos', {
                    url: '/payment-logos',
                    views: {
                        '': {
                            template: paymentLogosTemplate,
                            controllerAs: 'vm',
                            controller: function () {
                                let vm: any = this;
                                vm.title = 'Pay With';
                                vm.currentUser = {
                                    userId: 1334,
                                    userAlias: 'skent',
                                    firstname: 'Shaun',
                                    lastname: 'Kent',
                                    emailAddress: 'shaunkent81@gmail.com',
                                    profilePicture:
                                        'https://off-the-record-service-devo.s3.amazonaws.com/private/clients/profile-pictures/1316.jpeg',
                                    creationDateUtc: 1649369988000,
                                    dob: 1656979200000
                                };

                                vm.onSelectPayment = (selectedPayment) => {
                                    console.log('Payment selected', selectedPayment);
                                };

                                vm.onError = (error) => {
                                    console.log('from test', error);
                                };
                            }
                        }
                    }
                })
                .state('button-card', {
                    url: '/button-card',
                    views: {
                        '': {
                            template: buttonCardTemplate,
                            controllerAs: 'vm',
                            controller: function () {
                                let vm: any = this;
                                vm.theme = 'fusion-teal';
                                vm.iconClass = 'fa fa-solid fa-info';
                                vm.isIconShowing = true;
                                vm.cardTitle = 'Payment Plan Cases';
                                vm.statInfoToDisplay = '45%';
                                vm.isRouting = true;
                                vm.route = 'payment-logos';
                                vm.buttonText = 'Turn on payment plans.';
                                vm.isButtonVisible = true;
                                vm.cardMessage =
                                    'Firms who accept payment plans see a 10-15% lift in bookings.';
                                vm.statusToFilterOn = null;
                                vm.tooltipVisible = true;
                                vm.tooltipPlacement = 'bottom';
                                vm.tooltipMessage =
                                    'Accepting payment plans leads to more case bookings. Your account is experiencing a 7% increase in case bookings due to payment plans.';
                                vm.onSelectCard = (status) => {
                                    if (vm.statusToFilterOn) {
                                        vm.statusToFilterOn = null;
                                    } else {
                                        vm.statusToFilterOn = status;
                                    }

                                    console.log(vm.statusToFilterOn);
                                };

                                vm.onClick = () => {
                                    console.log('I have been clicked');
                                };
                            }
                        }
                    }
                })
                .state('multi-select-dropdown', {
                    url: '/multi-select-dropdown',
                    views: {
                        '': {
                            template: multiSelectDropdownTemplate,
                            controllerAs: 'vm',
                            controller: function () {
                                let vm: any = this;
                                vm.options = [
                                    {
                                        name: 'All States',
                                        label: 'All States',
                                        value: ''
                                    },
                                    {
                                        name: 'Alabama',
                                        label: 'Alabama Long Multi-Word Title',
                                        value: 'AL'
                                    },
                                    { name: 'Alaska', label: 'Alaska', value: 'AK' },
                                    { name: 'Arizona', label: 'Arizona', value: 'AZ' },
                                    { name: 'Arkansas', label: 'Arkansas', value: 'AR' },
                                    {
                                        name: 'California',
                                        label: 'California',
                                        value: 'CA'
                                    },
                                    { name: 'Colorado', label: 'Colorado', value: 'CO' },
                                    {
                                        name: 'Connecticut',
                                        label: 'Connecticut',
                                        value: 'CT'
                                    },
                                    { name: 'Delaware', label: 'Delaware', value: 'DE' },
                                    { name: 'Florida', label: 'Florida', value: 'FL' },
                                    { name: 'Georgia', label: 'Georgia', value: 'GA' },
                                    { name: 'Hawaii', label: 'Hawaii', value: 'HI' },
                                    { name: 'Idaho', label: 'Idaho', value: 'ID' }
                                ];

                                vm.selectedOptions = [];
                                vm.selectedGroupedOptions = [];

                                vm.optionsGrouped = [
                                    {
                                        group: 'Regions',
                                        set: [
                                            {
                                                id: 13,
                                                name: 'WEST',
                                                value: 'WEST',
                                                label: 'West'
                                            },
                                            {
                                                id: 14,
                                                name: 'EAST',
                                                value: 'EAST',
                                                label: 'East'
                                            },
                                            {
                                                id: 15,
                                                name: 'SOUTH',
                                                value: 'SOUTH',
                                                label: 'South'
                                            },
                                            {
                                                id: 16,
                                                name: 'MIDDLE',
                                                value: 'MIDDLE',
                                                label: 'Mid'
                                            },
                                            {
                                                id: 16,
                                                name: 'MIDDLE',
                                                value: 'MIDDLE',
                                                label: 'Extra Long Set Name ... Extra Long'
                                            }
                                        ]
                                    },
                                    {
                                        group: 'West',
                                        set: [
                                            {
                                                id: 1,
                                                name: 'CALIFORNIA',
                                                value: 'CA',
                                                label: 'California'
                                            },
                                            {
                                                id: 2,
                                                name: 'ALASKA',
                                                value: 'AK',
                                                label: 'Alaska'
                                            },
                                            {
                                                id: 3,
                                                name: 'ARIZONA',
                                                value: 'AZ',
                                                label: 'Arizona'
                                            },
                                            {
                                                id: 4,
                                                name: 'WEST',
                                                value: 'WA',
                                                label: 'West'
                                            }
                                            // Add more Western states here
                                        ]
                                    },
                                    {
                                        group: 'East',
                                        set: [
                                            {
                                                id: 4,
                                                name: 'NEW YORK',
                                                value: 'NY',
                                                label: 'New York'
                                            },
                                            {
                                                id: 5,
                                                name: 'FLORIDA',
                                                value: 'FL',
                                                label: 'Florida'
                                            },
                                            {
                                                id: 6,
                                                name: 'MASSACHUSETTS',
                                                value: 'MA',
                                                label: 'Massachusetts'
                                            }
                                            // Add more Eastern states here
                                        ]
                                    },
                                    {
                                        group: 'South',
                                        set: [
                                            {
                                                id: 7,
                                                name: 'TEXAS',
                                                value: 'TX',
                                                label: 'Texas'
                                            },
                                            {
                                                id: 8,
                                                name: 'GEORGIA',
                                                value: 'GA',
                                                label: 'Georgia'
                                            },
                                            {
                                                id: 9,
                                                name: 'FLORIDA',
                                                value: 'FL',
                                                label: 'Florida'
                                            }
                                            // Add more Southern states here
                                        ]
                                    },
                                    {
                                        group: 'Middle',
                                        set: [
                                            {
                                                id: 10,
                                                name: 'OHIO',
                                                value: 'OH',
                                                label: 'Ohio'
                                            },
                                            {
                                                id: 11,
                                                name: 'MICHIGAN',
                                                value: 'MI',
                                                label: 'Michigan'
                                            },
                                            {
                                                id: 12,
                                                name: 'INDIANA',
                                                value: 'IN',
                                                label: 'Indiana'
                                            }
                                            // Add more Middle states here
                                        ]
                                    }
                                    // Add more groups and states as needed
                                ];

                                vm.overrideOption = vm.options[0];
                                vm.logOptions = (options) => {
                                    console.log('Selected options: ', options);
                                };
                            }
                        }
                    }
                });
        }
    ]);
