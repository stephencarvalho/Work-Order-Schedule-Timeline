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

    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
      return null;
    }

    if (year < 1000 || year > 9999 || month < 1 || month > 12) {
      return null;
    }

    const maxDay = new Date(year, month, 0).getDate();
    if (day < 1 || day > maxDay) {
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
