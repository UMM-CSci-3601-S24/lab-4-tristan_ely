import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TodoService } from './todo.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule]
})
export class AddTodoComponent {

  addTodoForm = new FormGroup({
    owner: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(200),
    ])),

    status: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^(true|false)$'),
    ])),

    body: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(2000),
    ])),

    category: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^(software design|groceries|video games|homework)$'),
    ])),
  });

  readonly addTodoValidationMessages = {
    owner: [
      { type: 'required', message: 'Owner is required' },
      { type: 'minlength', message: 'Owner must be at least 2 characters long' },
      { type: 'maxlength', message: 'Owner cannot be more than 200 characters long' },
    ],
    status: [
      { type: 'required', message: 'Status is required' },
      { type: 'pattern', message: 'Status must be "true" or "false".' },
    ],
    body: [
      { type: 'required', message: 'Body is required' },
      { type: 'minlength', message: 'Body must be at least 2 characters long' },
      { type: 'maxlength', message: 'Body cannot be more than 2000 characters long' },
    ],
    category: [
      { type: 'required', message: 'Category is required' },
      { type: 'pattern', message: 'Category must be "software design", "groceries", "video games", or "homework".' },
    ],
  };

  constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar,
    private router: Router) {
  }

  formControlHasError(controlName: string): boolean {
    return this.addTodoForm.get(controlName).invalid &&
      (this.addTodoForm.get(controlName).dirty || this.addTodoForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.addTodoValidationMessages): string {
    for (const { type, message } of this.addTodoValidationMessages[name]) {
      if (this.addTodoForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    this.todoService.addTodo(this.addTodoForm.value).subscribe({
      next: (newId) => {
        this.snackBar.open(
          'Added todo ${this.addTodoForm.value.owner}',
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/todos/', newId]);
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      },
    });
  }
}
