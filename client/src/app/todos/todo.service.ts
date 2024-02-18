import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  readonly todoUrl: string = environment.apiUrl + 'todos';

  constructor(private httpClient: HttpClient) {
  }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTodos(filters?: { body?: string; category?: string; orderBy?: string }): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.body) {
        httpParams = httpParams.set('contains', filters.body);
      }
      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);
      }
      if (filters.orderBy) {
        httpParams = httpParams.set('orderby', filters.orderBy);
      }
    }

    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    })
  }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterTodos(todos: Todo[], filters: {limit?: number, status?: boolean, owner?: string, body?: string, page?: number } ): Todo[] {
    let filteredTodos = todos;

    if(filters.status != null) {
      filteredTodos = filteredTodos.filter(todo => todo.status === filters.status)
    }

    if(filters.owner) {
      filters.owner = filters.owner.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.owner.toLowerCase().indexOf(filters.owner) !== -1);
    }

    if (filters.body) {
      filters.body = filters.body.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.body.toLowerCase().indexOf(filters.body) !== -1);
    }

    if (filters.limit) {
      if (filters.page && filters.page <= filteredTodos.length / filters.limit) {
        const i = (filters.page - 1) * filters.limit;
        filteredTodos = filteredTodos.slice(i, i + filters.limit);
      }
      else {
        filteredTodos = filteredTodos.slice(0, filters.limit);
      }
    }

    return filteredTodos;
  }

  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(`${this.todoUrl}/${id}`);
  }

  addTodo(newTodo: Partial<Todo>): Observable<string> {
    return this.httpClient.post<{id: string}>(this.todoUrl, newTodo).pipe(map(res => res.id));
  }
}
