import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesTableComponent } from './services-table.component';

describe('TableComponent', () => {
    let component: ServicesTableComponent;
    let fixture: ComponentFixture<ServicesTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ServicesTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ServicesTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
