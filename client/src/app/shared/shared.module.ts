import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@NgModule({
    declarations: [HeaderComponent],
    exports: [HeaderComponent],
    imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
})
export class SharedModule {}
