import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as i0 from "@angular/core";
export class LayoutComponent {
    static { this.ɵfac = function LayoutComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LayoutComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LayoutComponent, selectors: [["app-layout"]], decls: 5, vars: 0, consts: [[1, "app-navbar"], ["href", "https://naologic.com/en/", "aria-label", "Naologic"], ["src", "/assets/images/NAOLOGIC-logo.svg", "alt", "Naologic", 1, "brand-image"], [1, "container-fluid", "app-content"]], template: function LayoutComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "nav", 0)(1, "a", 1);
            i0.ɵɵelement(2, "img", 2);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(3, "div", 3);
            i0.ɵɵelement(4, "router-outlet");
            i0.ɵɵelementEnd();
        } }, dependencies: [RouterOutlet], styles: [".app-navbar[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 3.125rem;\n  background-color: #ffffff;\n  display: flex;\n  align-items: center;\n  padding: 0 0 0 6.3125rem;\n}\n\n.brand-image[_ngcontent-%COMP%] {\n  display: block;\n  width: 5rem;\n  height: 0.625rem;\n}\n\n.app-content[_ngcontent-%COMP%] {\n  padding-top: 2.8125rem;\n  padding-left: 6.3125rem;\n  padding-right: 2.5rem;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LayoutComponent, [{
        type: Component,
        args: [{ selector: 'app-layout', standalone: true, imports: [RouterOutlet], template: "<nav class=\"app-navbar\">\n  <a href=\"https://naologic.com/en/\" aria-label=\"Naologic\">\n    <img src=\"/assets/images/NAOLOGIC-logo.svg\" alt=\"Naologic\" class=\"brand-image\" />\n  </a>\n</nav>\n\n<div class=\"container-fluid app-content\">\n  <router-outlet />\n</div>\n", styles: [".app-navbar {\n  width: 100%;\n  height: 3.125rem;\n  background-color: #ffffff;\n  display: flex;\n  align-items: center;\n  padding: 0 0 0 6.3125rem;\n}\n\n.brand-image {\n  display: block;\n  width: 5rem;\n  height: 0.625rem;\n}\n\n.app-content {\n  padding-top: 2.8125rem;\n  padding-left: 6.3125rem;\n  padding-right: 2.5rem;\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LayoutComponent, { className: "LayoutComponent", filePath: "src/app/layout/layout.component.ts", lineNumber: 11 }); })();
