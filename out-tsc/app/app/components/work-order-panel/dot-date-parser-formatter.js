import { Injectable } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as i0 from "@angular/core";
export class DotDateParserFormatter extends NgbDateParserFormatter {
    parse(value) {
        if (!value) {
            return null;
        }
        const parts = value.trim().split('.');
        if (parts.length !== 3) {
            return null;
        }
        const month = Number(parts[0]);
        const day = Number(parts[1]);
        const year = Number(parts[2]);
        if (!day || !month || !year) {
            return null;
        }
        return { day, month, year };
    }
    format(date) {
        if (!date) {
            return '';
        }
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        const year = String(date.year);
        return `${month}.${day}.${year}`;
    }
    static { this.ɵfac = /*@__PURE__*/ (() => { let ɵDotDateParserFormatter_BaseFactory; return function DotDateParserFormatter_Factory(__ngFactoryType__) { return (ɵDotDateParserFormatter_BaseFactory || (ɵDotDateParserFormatter_BaseFactory = i0.ɵɵgetInheritedFactory(DotDateParserFormatter)))(__ngFactoryType__ || DotDateParserFormatter); }; })(); }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: DotDateParserFormatter, factory: DotDateParserFormatter.ɵfac }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DotDateParserFormatter, [{
        type: Injectable
    }], null, null); })();
