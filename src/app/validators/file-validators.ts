// file-validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FileValidators {
  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (file) {
        if (!allowedTypes.includes(file.type)) {
          return { fileType: true };
        }
      }
      return null;
    };
  }

  static maxSize(maxSizeInBytes: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (file) {
        if (file.size > maxSizeInBytes) {
          return { maxSize: true };
        }
      }
      return null;
    };
  }
}