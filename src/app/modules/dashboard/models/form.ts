import { InputSignal, OutputEmitterRef, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface AddForm {
  closed: OutputEmitterRef<void>;
  isSubmitting: WritableSignal<boolean>;
  form: FormGroup;
  defaultForm(): FormGroup;
  close(): void;
  cleanUp(): void;
}

export interface EditForm {
  closed: OutputEmitterRef<void>;
  isSubmitting: WritableSignal<boolean>;
  form: FormGroup;
  id: InputSignal<string>;
  defaultForm(): FormGroup;
  close(): void;
  cleanUp(): void;
}
