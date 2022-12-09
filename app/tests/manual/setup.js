angular
    .module("otr-ui-shared-components")
    .config([
        "otrServiceProvider",
        function (otrServiceProvider) {
            otrServiceProvider.setDomain(
                "https://otr-backend-service-us-devo.offtherecord.com"
            );
        },
    ])
    .run([
        "$rootScope",
        function ($rootScope) {
            $rootScope.onSelect = (c) => {
                console.log("Selected item", c);
            };
            $rootScope.onChooseRating = (r) => {
                console.log("Rating chosen: ", r.rating);
            };
            $rootScope.regionCode = "WA";
            $rootScope.updateDashboardCases = (d) => {
                $rootScope.statusToFilterOn = d;
                console.log("Selected cases filter:", d);
            };

            // variables for stat card
            $rootScope.userNum = "20";
            $rootScope.statusToFilterOn = "cases_pending";
            $rootScope.isVacationMode = true;
            $rootScope.updateVacationMode = () => {
                $rootScope.isVacationMode = !$rootScope.isVacationMode;
            }

            // variables for toggle card
            $rootScope.message = "You are NOT accepting cases"
            $rootScope.uibMessage = "Accepting Cases is turned off for your law firm. You will not receive any new cases. If you wish to resume receiving cases, you can click the toggle switch to start receiving cases again at any time."
            $rootScope.title = "Not accepting cases";
            $rootScope.vacationModeUpdating = "false"
            $rootScope.isIconShowing = true;
            $rootScope.changeMessage = () => {
                $rootScope.vacationModeUpdating = true;

                setTimeout(() => {
                    $rootScope.vacationModeUpdating = false;
                    $rootScope.isVacationMode = !$rootScope.isVacationMode;
                    $rootScope.message = "You are accepting cases";
                    $rootScope.uibMessage = "Accepting Cases is turned on for your law firm. You will receive new cases to review as they are booked. If you need a break or are on vacation, you can click the toggle switch to pause receiving cases at any time.";
                    $rootScope.title = "Accepting cases";
                    $rootScope.$apply();
                }, 3000)
            }

            $rootScope.resetSelectedFilter = () => {
                $rootScope.statusToFilterOn = undefined;
            }

            $rootScope.removeIcons = () => {
                $rootScope.isIconShowing = false;
                console.log($rootScope.isIconShowing)
            }

            $rootScope.profileImageUrl = "https://graph.facebook.com/v2.8/3668555106576865/picture?height=961"
            $rootScope.name = "James Smith"
            $rootScope.avatarClass = "customer"
            $rootScope.brokenProfileImage = "https://s3.amazonaws.com/otr-assets/img/icons/jkfkl;jdaf"
            $rootScope.facebookProfilePicture = "https://graph.facebook.com/v2.5/10155312614059658/picture?height=961"
            $rootScope.undefinedName = undefined;
            $rootScope.size = 72;
        },
    ]);