import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SheinInstructions } from './shein-instructions';

describe('SheinInstructions', () => {
  let component: SheinInstructions;
  let fixture: ComponentFixture<SheinInstructions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheinInstructions],
    }).compileComponents();

    fixture = TestBed.createComponent(SheinInstructions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
