import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [JsonPipe, CommonModule, ReactiveFormsModule],
  template: `

  <form name="login"
        [formGroup]="formModel"
        (ngSubmit)="onsubmit()"
        class="form">
        <label for="title" class="title _center">Login</label>
        <div class="_row">
          <section>
            <input id="username"
              type="text"
              formControlName="username"
              />
          </section>
          <button type="submit" [disabled]="!formModel.valid">connection</button>
        </div>
        <pre class="_debug" *ngIf="!formModel.valid">
          Errors
        <hr>
          {{formModel.get('username')?.errors && 'username'}}
          {{formModel.get('username')?.errors | json}}
        </pre>
      </form>
      `,
  styles: `
  .form{
    display:flex;
    flex-direction: column;
    align-items: center;
  }
  .title{
    margin-bottom: 20px
  }
  `
})
export class LoginComponent {

  AuthService = inject(AuthService);

  formModel = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      forbiddenNameValidator(/bob/i),
      forbiddenNameValidator(/test/i)
    ])
  })

  async onsubmit(){
    if (!this.formModel.valid) throw new Error('form invalid')

    await this.AuthService.login(this.formModel.get('username')?.value ?? '')
    this.router.navigateByUrl('/')
  }

  private router=inject(Router)

  /** magic here - order is always correct - infer via type ? */
  constructor(router:Router, auth:AuthService){
    console.debug('[login] construct', {router, auth});
  }
}

/** A hero's name can't match the given regular expression */
function forbiddenNameValidator(nameRe: RegExp):ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}
