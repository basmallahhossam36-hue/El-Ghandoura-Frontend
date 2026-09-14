import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    alert('Please login first.');
    return router.createUrlTree(['/login']);
  }

  if (authService.getRole() !== 'admin') {
    alert('Access denied. Admin only.');
    return router.createUrlTree(['/']);
  }

  return true;
};