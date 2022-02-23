import angular from "angular";
import { getDocument, GlobalWorkerOptions, PDFPageProxy } from "pdfjs-dist";
// Set the pdfjsLib worker source manually - https://github.com/mozilla/pdf.js/issues/8305
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

interface IPDFImagePreviewBindings {
  pdf: string | URL;
  scale?: number;
  canvasWidth?: number;
  canvasHeight?: number;
}

interface IPDFImagePreviewCtrl extends IPDFImagePreviewBindings {
  $onInit: () => void;
  getImagePreviewFromPDF: (pdf: string | URL) => void;
  makeThumb: (page: PDFPageProxy) => void;
}

class PDFImagePreviewCtrl implements IPDFImagePreviewCtrl {
  static $inject: string[] = ["$element", "$scope", "$window"];

  // Bindings
  pdf!: string | URL;
  scale?: number;
  canvasWidth?: number;
  canvasHeight?: number;

  // Interface
  isLoadingPDF = true;
  hasErrorLoadingPDF = false;

  constructor(
    private $element: angular.IRootElementService,
    private $scope: angular.IRootScopeService,
    private $window: angular.IWindowService
  ) {
    GlobalWorkerOptions.workerSrc = pdfjsWorker;
  }

  async $onInit() {
    await this.getImagePreviewFromPDF(this.pdf);
  }

  public async getImagePreviewFromPDF(pdf: string | URL) {
    try {
      const doc = await getDocument(pdf).promise;
      const page: PDFPageProxy = await doc.getPage(1);
      const canvas = await this.makeThumb(page);

      const div = this.$element.find(".pdf-preview");
      div.append(canvas);
    } catch (error) {
      console.error("Error loading PDF Preview: ", error);
      this.hasErrorLoadingPDF = true;
    } finally {
      this.isLoadingPDF = false;
      this.$scope.$apply();
    }
  }

  async makeThumb(page: PDFPageProxy) {
    const scale = this.scale || 1.5;
    const viewport = page.getViewport({ scale: scale });
    const outputScale = this.$window.devicePixelRatio || 1;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = this.canvasWidth || 900;
    canvas.height = this.canvasHeight || 700;
    canvas.style.width = "100%";
    canvas.style.height = "auto";

    const transform =
      outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

    if (!context || !(context instanceof CanvasRenderingContext2D)) {
      throw new Error("Failed to get 2D context");
    }

    const renderContext = {
      canvasContext: context,
      transform: transform,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
    return canvas;
  }
}

angular.module("otr-ui-shared-components").component("appPdfImagePreview", {
  controller: PDFImagePreviewCtrl,
  controllerAs: "vm",
  templateUrl: "/components/pdf-image-preview/pdf-image-preview.html",
  bindings: {
    pdf: "<",
    scale: "<?",
    canvasWidth: "<?",
    canvasHeight: "<?",
  },
});
