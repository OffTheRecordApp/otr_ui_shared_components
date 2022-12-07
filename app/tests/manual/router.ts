import angular from 'angular';
import courtTemplate from './courts.html';
import otrSearchTemplate from '../../otr-search-template.html';
import violationsTemplate from './violations.html';
import pdfTemplate from './pdf.html';
import starRatingTemplate from './star-rating.html';
import statCardsTemplate from './stat-cards.html';
import toggleCardsTemplate from './toggle-cards.html';
import avatarFallbackTemplate from './avatars.html';

angular.module('otr-ui-shared-components')
    .run(['$templateCache', ($templateCache) => {
            $templateCache.put('/otr-search-template.html', otrSearchTemplate);
        }]
    ).config([
        '$stateProvider',
        "otrServiceProvider",
        function ($stateProvider, otrServiceProvider) {
            otrServiceProvider.setDomain(
                "https://otr-backend-service-us-devo.offtherecord.com"
            );

            $stateProvider.state('courts', {
                url: '/courts',
                views: {
                    '': {
                        template: courtTemplate,
                        controllerAs: 'vm',
                        controller: function() {
                            let vm: any = this;
                            vm.regionCode = "WA";
                            vm.onSelect = (c) => {
                                console.log("Selected court", c);
                            }
                        }
                    }
                }
            }).state('violations', {
                url: '/violations',
                views: {
                    '': {
                        template: violationsTemplate,
                        controllerAs: 'vm',
                        controller: function() {
                            let vm: any = this;
                            vm.regionCode = 'WA';
                            vm.onSelect = (c) => {
                                console.log("Selected violation", c);
                            }
                        }
                    }
                }
            }).state("pdf-preview", {
                url: '/pdf',
                views: {
                    '': {
                        template: pdfTemplate
                    }
                }
            }).state('star-rating', {
                url: './stars',
                views: {
                    '': {
                        template: starRatingTemplate,
                        controller: function() {
                            let vm: any = this;
                            vm.onChooseRating = (r) => {
                                console.log("Rating chosen: ", r.rating);
                            };
                        }
                    }
                }
            }).state('stat-cards', {
                url: '/stat-cards',
                views: {
                    '': {
                        template: statCardsTemplate,
                        controllerAs: 'vm',
                        controller: function() {
                            let vm: any = this;
                            vm.isIconShowing = true;
                            // variables for stat card
                            vm.userNum = "20";
                            vm.statusToFilterOn = "cases_pending";

                            vm.toggleIcons = () => {
                                vm.isIconShowing = !vm.isIconShowing;
                            }

                            vm.updateDashboardCases = (d) => {
                                vm.statusToFilterOn = d;
                                console.log("Selected cases filter:", d);
                            };

                            vm.resetSelectedFilter = () => {
                                console.log("status is ", vm.statusToFilterOn);
                                vm.statusToFilterOn = ""
                            }
                        }
                    }
                }
            }).state('toggle-cards', {
                url: '/toggle-cards',
                views: {
                    '': {
                        template: toggleCardsTemplate,
                        controllerAs: 'vm',
                        controller: function($timeout) {
                            let vm: any = this;
                            // variables for toggle card
                            vm.message = "You are NOT accepting cases"
                            vm.uibMessage = "Accepting Cases is turned off for your law firm. You will not receive any new cases. If you wish to resume receiving cases, you can click the toggle switch to start receiving cases again at any time."
                            vm.title = "Not accepting cases";
                            vm.vacationModeUpdating = "false"
                            vm.isVacationMode = true;

                            vm.updateVacationMode = () => {
                                vm.isVacationMode = !vm.isVacationMode;
                            }

                            vm.changeMessage = () => {
                                vm.vacationModeUpdating = true;

                                $timeout(() => {
                                    vm.vacationModeUpdating = false;
                                    vm.isVacationMode = !vm.isVacationMode;
                                    vm.message = "You are accepting cases";
                                    vm.uibMessage = "Accepting Cases is turned on for your law firm. You will receive new cases to review as they are booked. If you need a break or are on vacation, you can click the toggle switch to pause receiving cases at any time.";
                                    vm.title = "Accepting cases";
                                }, 500)
                            }
                        }
                    }
                }
            }).state('avatars', {
                url: '/avatars',
                views: {
                    '': {
                        template: avatarFallbackTemplate,
                        controllerAs: 'vm',
                        controller: function() {
                            let vm: any = this;
                            vm.profileImageUrl = "https://graph.facebook.com/v2.8/3668555106576865/picture?height=961"
                            vm.name = "James Smith"
                            vm.avatarClass = "customer"
                            vm.brokenProfileImage = "https://s3.amazonaws.com/otr-assets/img/icons/jkfkl;jdaf"
                            vm.facebookProfilePicture = "https://graph.facebook.com/v2.5/10155312614059658/picture?height=961"
                            vm.undefinedName = undefined;
                            vm.size = 72;
                        }
                    }
                }
            })
        },
    ]);