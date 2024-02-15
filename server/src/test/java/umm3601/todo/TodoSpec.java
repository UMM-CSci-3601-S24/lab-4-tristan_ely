package umm3601.todo;

import org.junit.jupiter.api.BeforeEach;

public class TodoSpec {

private static final String FAKE_ID_STRING_1 = "fakeIdOne";
private static final String FAKE_ID_STRING_2 = "fakeIdTwo";

private Todo todo1;
private Todo todo2;

@BeforeEach
  void setupEach() {
    todo1 = new Todo();
    todo2 = new Todo();
  }
}
