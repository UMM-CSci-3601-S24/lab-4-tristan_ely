import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from './todo';
import { TodoService } from './todo.service';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatNavList, MatListSubheaderCssMatStyler, MatListItem, MatListItemAvatar, MatListItemTitle, MatListItemLine } from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';

import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatHint, MatError } from '@angular/material/form-field';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { TodoCardComponent } from "./todo-card.component";



@Component({
    selector: 'app-todo-list-component',
    templateUrl: 'todo-list.component.html',
    styleUrl: './todo-list.component.scss',
    providers: [],
    standalone: true,
    imports: [MatPaginatorModule, MatIconModule, MatCard, MatCardTitle, MatCardContent, MatFormField, MatLabel, MatInput, FormsModule, MatHint, MatSelect, MatOption, MatRadioGroup, MatRadioButton, MatNavList, MatListSubheaderCssMatStyler, MatListItem, RouterLink, MatListItemAvatar, MatListItemTitle, MatListItemLine, MatError, TodoCardComponent]
})

export class TodoListComponent implements OnInit, OnDestroy{
public serverFilteredTodos: Todo[];
public filteredTodos: Todo[];
public length: number;

public todoLimit: number = 10;
public todoPage: number = 0;
public todoStatus: boolean;
public todoOwner: string;
public todoBody: string;
public todoCategory: string;
public todoOrderBy: string;
public viewType: 'list' | 'card' = 'list';


errMsg='';
private ngUnsubscribe = new Subject<void>();

/**
 * This constructor injects both an instance of `UserService`
 * and an instance of `MatSnackBar` into this component.
 *
 * @param todoService the `UserService` used to get users from the server
 * @param snackBar the `MatSnackBar` used to display feedback
 */
constructor(private todoService: TodoService, private snackBar: MatSnackBar) {
}


  getTodosFromServer(): void {

    this.todoService.getTodos({
      orderBy: this.todoOrderBy,
      body: this.todoBody,
      category: this.todoCategory
    }).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedTodos) => {
        this.serverFilteredTodos = returnedTodos;
        this.updateFilter();
      },
      error: (err) => {
        if (err.error instanceof ErrorEvent) {
          this.errMsg = `Problem in the client – Error: ${err.error.message}`;
        } else {
          this.errMsg = `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`;
        }
      },
    })
  }

  public updateFilter() {
    this.filteredTodos = this.todoService.filterTodos(
      this.serverFilteredTodos, { limit: this.todoLimit, status: this.todoStatus, owner: this.todoOwner, body: this.todoBody, page: this.todoPage}
    );
    this.length = this.todoService.getLength();
  }

  public changePage(event: { pageIndex: number; pageSize: number; }) {
    this.todoPage = event.pageIndex;
    this.todoLimit = event.pageSize;
    this.updateFilter();
  }

  ngOnInit(): void {
    this.getTodosFromServer();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
