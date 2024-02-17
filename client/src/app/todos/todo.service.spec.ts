import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  const testTodos: Todo[] = [
    {
      _id: 'chris_id',
      owner: 'Chris',
      status: true,
      body: 'UMM',
      category: 'video games'
    },
    {
      _id: 'james_id',
      owner: 'James',
      status: false,
      body: 'sit',
      category: 'groceries'
    },
    {
      _id: 'bob_id',
      owner: 'Bob',
      status: true,
      body: 'dress',
      category: 'groceries'
    },
  ];
  let todoService: TodoService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    todoService = new TodoService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getTodos()', () => {

    it('calls `api/todos` when `getTodos()` is called with no parameters', () => {
      todoService.getTodos().subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      const req = httpTestingController.expectOne(todoService.todoUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(testTodos);
    });

    describe('Calling getTodos() with parameters correctly form the HTTP request', () => {

      it('correctly calls api/todos with filter parameter \'category\'', () => {
        todoService.getTodos({ sortBy: 'category' }).subscribe(
          todos => expect(todos).toBe(testTodos)
        )

        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('sortby')
        );

        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('sortby')).toEqual('category');

        req.flush(testTodos);
      });
    })

    it('correctly calls api/todos with filter parameter \'sit\'', () => {
      todoService.getTodos({ body: 'sit' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('contains')
      );

      expect(req.request.method).toEqual('GET');

      expect(req.request.params.get('contains')).toEqual('sit');

      req.flush(testTodos);
    });

    it('correctly calls api/todos with filter parameter \'groceries\'', () => {
      todoService.getTodos({ category: 'groceries' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('category')
      );

      expect(req.request.method).toEqual('GET');

      expect(req.request.params.get('category')).toEqual('groceries');

      req.flush(testTodos);
    });

    it('correctly calls api/todos with multiple filter parameters', () => {

      todoService.getTodos({ body: 'sit', category: 'groceries', sortBy: 'owner' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('contains') && request.params.has('category') && request.params.has('sortby')
      );

      expect(req.request.method).toEqual('GET');

      expect(req.request.params.get('contains')).toEqual('sit');
      expect(req.request.params.get('category')).toEqual('groceries');
      expect(req.request.params.get('sortby')).toEqual('owner');

      req.flush(testTodos);
      });
    });



  describe('filterTodos()', () => {

    it('filters by nothing', () => {
      const filteredTodos = todoService.filterTodos(testTodos, {});
      expect(filteredTodos.length).toBe(3);
    });

    it('limits todos displayed', () => {
      const filteredTodos = todoService.filterTodos(testTodos, { limit: 1 });
      // Should only have 1 todo in array
      expect(filteredTodos.length).toBe(1);
    });

    it('filters by status true', () => {
      const todoStatus = true;
      const filteredTodos = todoService.filterTodos(testTodos, { status: todoStatus });
      expect(filteredTodos.length).toBe(2);
      filteredTodos.forEach(todo => {
        expect(todo.status === todoStatus);
      })
    });

    it('filters by status false', () => {
      const todoStatus = false;
      const filteredTodos = todoService.filterTodos(testTodos, { status: todoStatus });
      expect(filteredTodos.length).toBe(1);
      filteredTodos.forEach(todo => {
        expect(todo.status === todoStatus);
      });
    });

    it('filters by owner Bob', () => {
      const todoOwner = 'Bob';
      const filteredTodos = todoService.filterTodos(testTodos, { owner: todoOwner });
      expect(filteredTodos.length).toBe(1);
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
      })
    });

    it('filters by owner Bob, status true, and limit 1', () => {
      const todoOwner = 'Bob';
      const todoStatus = true;
      const filteredTodos = todoService.filterTodos(testTodos, { owner: todoOwner, status: todoStatus, limit: 1 });
      expect(filteredTodos.length).toBe(1);
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
        expect(todo.status === todoStatus);
      })
    });

  });
});
