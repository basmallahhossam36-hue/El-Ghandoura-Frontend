import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-shein-instructions',
  standalone: true,
  imports: [],
  templateUrl: './shein-instructions.html',
  styleUrl: './shein-instructions.css'
})
export class SheinInstructions {

  private languageService = inject(LanguageService);

  get isArabic(): boolean {
    return this.languageService.isArabic();
  }

}