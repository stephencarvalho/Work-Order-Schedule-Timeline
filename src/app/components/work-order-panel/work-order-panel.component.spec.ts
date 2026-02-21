import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';

import { WorkOrderPanelComponent } from './work-order-panel.component';

describe('WorkOrderPanelComponent', () => {
  let fixture: ComponentFixture<WorkOrderPanelComponent>;
  let component: WorkOrderPanelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderPanelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrderPanelComponent);
    component = fixture.componentInstance;
  });

  function setOpen(open: boolean): void {
    const prev = component.isOpen;
    component.isOpen = open;
    component.ngOnChanges({
      isOpen: new SimpleChange(prev, open, false)
    });
  }

  it('toggles open/close state with animation timeout and clears timeout on destroy', () => {
    jasmine.clock().install();

    setOpen(true);
    expect(component.isPanelVisible).toBeTrue();
    expect(component.isPanelClosing).toBeFalse();

    setOpen(false);
    expect(component.isPanelClosing).toBeTrue();
    jasmine.clock().tick(component.closeAnimationMs + 1);
    expect(component.isPanelVisible).toBeFalse();
    expect(component.isPanelClosing).toBeFalse();

    setOpen(true);
    setOpen(false);
    component.ngOnDestroy();

    jasmine.clock().uninstall();
  });

  it('clears existing close timeout when opening state changes', () => {
    jasmine.clock().install();
    (component as any).closeAnimationTimeoutId = window.setTimeout(() => undefined, 1000);

    component.isOpen = true;
    component.ngOnChanges({
      isOpen: new SimpleChange(false, true, false)
    });

    expect((component as any).closeAnimationTimeoutId).toBeNull();
    jasmine.clock().uninstall();
  });

  it('resets from non-isOpen changes when panel is open', () => {
    component.isOpen = true;
    const resetSpy = spyOn<any>(component, 'resetFormValues').and.callThrough();

    component.ngOnChanges({
      editingOrder: new SimpleChange(null, null, false),
      defaultStartDate: new SimpleChange('', '2026-01-01', false),
      defaultEndDate: new SimpleChange('', '2026-01-02', false),
      defaultWorkCenterId: new SimpleChange(null, 'wc-001', false)
    });

    expect(resetSpy).toHaveBeenCalled();
  });

  it('evaluates default date/workcenter change branches when open', () => {
    component.isOpen = true;

    component.ngOnChanges({
      defaultStartDate: new SimpleChange('', '2026-01-01', false)
    });

    component.ngOnChanges({
      defaultEndDate: new SimpleChange('', '2026-01-02', false)
    });

    component.defaultWorkCenterId = 'wc-001';
    component.ngOnChanges({
      defaultWorkCenterId: new SimpleChange(null, 'wc-001', false)
    });

    expect(component.form.controls.workCenterId.value).toBe('wc-001');
  });

  it('resets form in create mode and reports field errors', () => {
    component.defaultWorkCenterId = 'wc-001';
    component.defaultStartDate = '2026-02-01';
    component.defaultEndDate = '2026-02-05';

    component.isOpen = true;
    component.ngOnChanges({
      isOpen: new SimpleChange(false, true, true),
      defaultWorkCenterId: new SimpleChange(null, 'wc-001', true),
      defaultStartDate: new SimpleChange('', component.defaultStartDate, true),
      defaultEndDate: new SimpleChange('', component.defaultEndDate, true)
    });

    expect(component.form.controls.workCenterId.value).toBe('wc-001');
    expect(component.form.controls.status.value).toBe('open');

    component.form.controls.name.setValue('');
    component.form.controls.name.markAsTouched();
    expect(component.hasFieldError('name')).toBeTrue();
    expect(component.actionLabel).toBe('Create');
    expect(component.statusChipClass('blocked')).toBe('chip-blocked');
  });

  it('resets form in edit mode and submits with existing order id', () => {
    component.mode = 'edit';
    component.editingOrder = {
      docId: 'wo-1',
      docType: 'workOrder',
      data: {
        name: 'Edited',
        workCenterId: 'wc-002',
        status: 'in-progress',
        startDate: '2026-03-10',
        endDate: '2026-03-12'
      }
    };

    component.isOpen = true;
    component.ngOnChanges({
      isOpen: new SimpleChange(false, true, true),
      editingOrder: new SimpleChange(null, component.editingOrder, true)
    });

    expect(component.form.controls.name.value).toBe('Edited');
    expect(component.form.controls.workCenterId.value).toBe('wc-002');
    expect(component.actionLabel).toBe('Save');

    component.startDateInputRef = { nativeElement: { value: '03.10.2026' } } as never;
    component.endDateInputRef = { nativeElement: { value: '03.12.2026' } } as never;

    const emitSpy = spyOn(component.submitted, 'emit');
    component.onSubmit();

    expect(emitSpy).toHaveBeenCalled();
    expect(emitSpy.calls.mostRecent().args[0]!.existingOrderId).toBe('wo-1');
  });

  it('submits create mode with undefined existingOrderId', () => {
    component.mode = 'create';
    component.startDateInputRef = { nativeElement: { value: '03.10.2026' } } as never;
    component.endDateInputRef = { nativeElement: { value: '03.12.2026' } } as never;
    component.form.controls.name.setValue('New Work');
    component.form.controls.workCenterId.setValue('wc-001');
    component.form.controls.status.setValue('open');

    const emitSpy = spyOn(component.submitted, 'emit');
    component.onSubmit();

    expect(emitSpy.calls.mostRecent().args[0]!.existingOrderId).toBeUndefined();
  });

  it('marks form touched when invalid and handles blank trimmed name', () => {
    const markSpy = spyOn(component.form, 'markAllAsTouched').and.callThrough();

    component.startDateInputRef = { nativeElement: { value: '' } } as never;
    component.endDateInputRef = { nativeElement: { value: '' } } as never;
    component.onSubmit();
    expect(markSpy).toHaveBeenCalled();

    component.form.controls.name.setValue('   ');
    component.form.controls.workCenterId.setValue('wc-001');
    component.form.controls.status.setValue('open');
    component.form.controls.startDate.setValue({ year: 2026, month: 1, day: 1 });
    component.form.controls.endDate.setValue({ year: 2026, month: 1, day: 1 });
    component.startDateInputRef = { nativeElement: { value: '01.01.2026' } } as never;
    component.endDateInputRef = { nativeElement: { value: '01.01.2026' } } as never;

    const emitSpy = spyOn(component.submitted, 'emit');
    component.onSubmit();
    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.form.controls.name.errors?.['required']).toBeTrue();
  });

  it('validates date range and picker navigation helpers', () => {
    const datepicker = {
      state: { firstDate: { year: 2026, month: 4, day: 15 } as NgbDateStruct },
      navigateTo: jasmine.createSpy('navigateTo')
    } as never;

    expect(component.pickerMonth(datepicker)).toBe(4);
    expect(component.pickerYear(datepicker)).toBe(2026);

    component.onPickerMonthChange(datepicker, 7);
    expect((datepicker as any).navigateTo).toHaveBeenCalledWith({ year: 2026, month: 7, day: 1 });

    component.onPickerYearChange(datepicker, 2030);
    expect((datepicker as any).navigateTo).toHaveBeenCalledWith({ year: 2030, month: 4, day: 1 });

    component.shiftPickerMonth(datepicker, 2);
    expect((datepicker as any).navigateTo).toHaveBeenCalledWith({ year: 2026, month: 6, day: 1 });

    component.form.controls.startDate.setValue({ year: 2026, month: 4, day: 20 });
    component.form.controls.endDate.setValue({ year: 2026, month: 4, day: 10 });
    expect(component.form.errors?.['invalidRange']).toBeTrue();
  });

  it('returns early when start/end/work center missing after invalid bypass and uses picker fallback date', () => {
    spyOnProperty(component.form, 'invalid', 'get').and.returnValue(false);
    component.form.controls.name.setValue('Name');
    component.form.controls.workCenterId.setValue(null);
    component.form.controls.startDate.setValue(null);
    component.form.controls.endDate.setValue(null);

    const emitSpy = spyOn(component.submitted, 'emit');
    component.onSubmit();
    expect(emitSpy).not.toHaveBeenCalled();

    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 4, 6));
    const datepicker = {
      state: { firstDate: null },
      navigateTo: jasmine.createSpy('navigateTo')
    } as never;

    expect(component.pickerYear(datepicker)).toBe(2026);
    expect(component.pickerMonth(datepicker)).toBe(5);
    jasmine.clock().uninstall();
  });

  it('emits close event', () => {
    const closeSpy = spyOn(component.closed, 'emit');
    component.onClose();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('reports field error for dirty invalid field', () => {
    component.form.controls.name.setValue('');
    component.form.controls.name.markAsDirty();
    expect(component.hasFieldError('name')).toBeTrue();
  });
});
