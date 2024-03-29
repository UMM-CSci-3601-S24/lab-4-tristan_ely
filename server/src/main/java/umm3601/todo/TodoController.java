package umm3601.todo;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;

public class TodoController implements Controller {

  private static final String API_TODOS = "api/todos";
  private static final String API_TODO_ID = "api/todos/{id}";
  static final String SORT_ORDER_KEY = "sortorder";

  private static final String CATEGORY_REGEX = "^(software design|video games|homework|groceries|)$";

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
    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    ArrayList<Todo> matchingTodos = todoCollection
      .find(combinedFilter)
      .sort(sortingOrder)
      .into(new ArrayList<>());

    ctx.json(matchingTodos);
    ctx.status(HttpStatus.OK);
  }

  public void getTodo(Context ctx) {
    String id = ctx.pathParam("id");
    Todo todo;

    try {
      todo = todoCollection.find(new Document("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested todo id wasn't a legal Mongo Object ID.");
    }
    if (todo == null) {
      throw new NotFoundResponse("The requested todo was not found");
    } else {
      ctx.json(todo);
      ctx.status(HttpStatus.OK);
    }
  }

  private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>();

    if (ctx.queryParamMap().containsKey("category")) {
      String category = ctx.queryParamAsClass("category", String.class).get();
      filters.add(eq("category", category));
    }

    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);
    return combinedFilter;
  }

  private Bson constructSortingOrder(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("orderby"), "owner");
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ? Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
  }

  @Override
  public void addRoutes(Javalin server) {

    server.get(API_TODO_ID, this::getTodo);

    server.get(API_TODOS, this::getTodos);

    server.post(API_TODOS, this::addNewTodo);

  }

  public void addNewTodo(Context ctx) {
    Todo newTodo = ctx.bodyValidator(Todo.class)
      .check(tdo -> tdo.owner != null && tdo.owner.length() > 0, "Todo must have a non-empty owner")
      .check(tdo -> tdo.status || !tdo.status, "Todo must have a boolean status")
      .check(tdo -> tdo.body != null && tdo.body.length() > 0, "Todo must have a non-empty body")
      .check(tdo -> tdo.category.matches(CATEGORY_REGEX), "Todo must have a valid category")
      .get();

    todoCollection.insertOne(newTodo);

    ctx.json(Map.of("id", newTodo._id));
    ctx.status(HttpStatus.CREATED);
  }
}
