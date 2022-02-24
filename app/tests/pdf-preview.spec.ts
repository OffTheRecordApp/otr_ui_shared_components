// import { mock } from "angular";
// import { PDFImagePreviewComponent } from "@controllers/conversation/pdf-image-preview.component";

// describe("PDFImagePreviewComponent", () => {
//   beforeEach(mock.module("otr"));

//   let vm: PDFImagePreviewComponent, $scope, $element;

//   // TODO: pull this logic out into a separate file
//   beforeEach(inject(($httpBackend) => {
//     $httpBackend
//       .whenGET("@@endpoint/api/v1/user")
//       .respond(200, { user: { roles: [{ roleType: "LAWYER" }] } });

//     // TODO & WARNING: revisit this because this call should not being happening and may not allow asserts against the DOM
//     $httpBackend.whenGET("app/pages/login/login.view.html").respond(200, {});
//   }));

//   beforeEach(inject((_$componentController_, _$rootScope_, $window) => {
//     $scope = _$rootScope_.$new();
//     $element = jasmine.createSpyObj("$element", ["find"]);
//     $window.pdfjsLib = {
//       getDocument: (foo) => {
//         return {
//           promise: {
//             getPage: (bar) => {
//               return { getViewPort: () => null, render: () => null };
//             },
//           },
//         };
//       },
//     };

//     vm = _$componentController_("pdfImagePreview", {
//       $element: $element,
//       $scope: $scope,
//       $window: $window,
//     });
//   }));

//   it("Should set hasErrorLoadingPDF to true if image preview fails", async () => {
//     vm.pdf = "foo.pdf";
//     vm.hasErrorLoadingPDF = false;

//     $element.find.and.returnValue({ append: (canvas: any) => null });

//     spyOn(vm, "makeThumb").and.rejectWith("error");

//     await vm.getImagePreviewFromPDF(vm.pdf);

//     expect(vm.hasErrorLoadingPDF).toBeTrue();
//   });
// });
