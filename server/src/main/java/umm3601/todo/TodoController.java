package umm3601.todo;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.DeleteResult;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;

public class TodoController implements Controller {

  private static final String API_TODOS = "api/todos";
  private static final String API_TODO_ID = "api/todos/:id";
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

  public void getTodos(Context ctx) {
    Bson combinedFilter = constructFilter
    Bson sortingOrder = constructSortingOrder(ctx);

  ArrayList<Todo> matchingTodos = todoCollection
  .find(combinedFilter)
  .sort(sortingOrder)
  .into(new ArrayList<>());

  ctx.json(matchingTodos);
  ctx.status(HttpStatus.OK);

  }

  @Override
  public void addRoutes(Javalin server) {
    // Get a single todo by ID
    server.get(API_USER_BY_ID, this::getTodo);
    // list todos, filtered using query parameters
    server.get(API_TODOS, this::getTodos);

  }
}
