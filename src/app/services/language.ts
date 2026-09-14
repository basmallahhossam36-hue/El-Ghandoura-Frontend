import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  isArabic = signal(false);

  toggleLanguage(): void {
    this.isArabic.update(value => !value);
  }

}