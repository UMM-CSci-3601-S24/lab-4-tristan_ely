package umm3601.todo;

import org.bson.UuidRepresentation;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;

import umm3601.Controller;

public class TodoController implements Controller {

  private static final String AP_TODOS = "api/todos";
  private static final String AP_TODO_ID = "api/todos/:id";
  static final String SORT_ORDER_KEY = "sortorder";

  private final JacksonMongoCollection<Todo> todoCollection;

  /**
   * Construct a controller for todos.
   *
   * @param database the database containing todo data
   */
  public TodoController(MongoDatabase database) {
    todoCollection = JacksonMongoCollection.builder().build(
        database,
        "todos",
        Todo.class,
        UuidRepresentation.STANDARD);
  }
}
