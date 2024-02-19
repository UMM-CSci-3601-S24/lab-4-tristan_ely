import { AddTodoPage } from '../support/add-todo.po'

describe('Add todo', () => {
  const page = new AddTodoPage()

  beforeEach(() => {
    page.navigateTo()
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo')
  });

  it('Button should start disabled', () => {
    page.addTodoButton().should('be.disabled')
  });

});
