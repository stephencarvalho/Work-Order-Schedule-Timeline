import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DotDateParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
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

  format(date: NgbDateStruct | null): string {
    if (!date) {
      return '';
    }

    const month = String(date.month).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');
    const year = String(date.year);

    return `${month}.${day}.${year}`;
  }
}
