import { TestBed } from '@angular/core/testing';

import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  it('creates layout component', () => {
    TestBed.configureTestingModule({
      imports: [LayoutComponent]
    });

    const fixture = TestBed.createComponent(LayoutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
