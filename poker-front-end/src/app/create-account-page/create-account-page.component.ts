import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-account-page',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './create-account-page.component.html',
  styleUrls: ['./create-account-page.component.css']
})
export class CreateAccountPageComponent {
  title = 'Poker Odds Calculator';
  createAccountForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.createAccountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit() {
    document.body.style.backgroundImage = 'url(../../assets/backgrounds/default.jpg)';
  }

  async onSubmit() {
    if (this.createAccountForm.valid) {
      const { firstName, lastName, email, password } = this.createAccountForm.value;
      await this.authService.registerWithCredentials(firstName, lastName, email, password);
    }
  }
}