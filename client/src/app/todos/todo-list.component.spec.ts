import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTodoService } from '../../testing/todo.service.mock';
import { Todo } from './todo';
import { TodoService } from './todo.service';
import { Observable } from 'rxjs';
import { TodoListComponent } from './todo-list.component';

const COMMON_IMPORTS: unknown[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('TodoListComponent', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [COMMON_IMPORTS, TodoListComponent],
    providers: [{ provide: TodoService, useValue: new MockTodoService() }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the todos', () => {
    expect(todoList.serverFilteredTodos.length).toBe(3);
  });

  it('contains a todo with owner "Chris"', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.owner === 'Chris')).toBe(true);
  });

  it('contains a todo with category "video games"', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.category === 'video games')).toBe(true);
  });

  it('doesn\'t contain a todo with category "sports"', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.category === 'sports')).toBe(false);
  });

  it('contains a todo with status "true"', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.status === true)).toBe(true);
  });

  it('contains a todo with bodyText "sit"', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.body === 'sit')).toBe(true);
  });

  it('contains two todos with category "groceries"', () => {
    expect(todoList.serverFilteredTodos.filter((todo: Todo) => todo.category === 'groceries').length).toBe(2);
  });
});

describe('Misbehaving Todo List', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoServiceStub: {
    getTodos: () => Observable<Todo[]>;
    getTodosFiltered: () => Observable<Todo[]>;
  };

  beforeEach(() => {
    todoServiceStub = {
      getTodos: () => new Observable(observer => {
        observer.error('getTodos() Observer generates an error');
      }),
      getTodosFiltered: () => new Observable(observer => {
        observer.error('getTodosFiltered() Observer generates an error');
      })
    };

    TestBed.configureTestingModule({
    imports: [COMMON_IMPORTS, TodoListComponent],
    providers: [{ provide: TodoService, useValue: todoServiceStub }]
});
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('fails to load users if we do not set up a TodosService', () => {
    expect(todoList.serverFilteredTodos).toBeUndefined();
  });
});
