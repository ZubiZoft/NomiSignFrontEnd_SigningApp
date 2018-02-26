import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsConditionsComponentComponent } from './terms-conditions-component.component';

describe('TermsConditionsComponentComponent', () => {
  let component: TermsConditionsComponentComponent;
  let fixture: ComponentFixture<TermsConditionsComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsConditionsComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsConditionsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
