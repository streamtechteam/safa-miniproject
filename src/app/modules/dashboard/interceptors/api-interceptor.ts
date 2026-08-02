import { HttpInterceptorFn } from '@angular/common/http';

export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
  // placeholder interceptor for future use
  return next(req);
};
