import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const geoPointRequiredValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;
  if (!value || (value.latitude === 0 && value.longitude === 0)) {
    return { geoPointRequired: true };
  }
  return null;
};
