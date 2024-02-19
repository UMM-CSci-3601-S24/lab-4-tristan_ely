
export class TodoListPage {

  private readonly radioButtonSelector = `[data-test=viewTypeRadio] mat-radio-button`;
  private readonly addTodoButtonSelector = '[data-test=addTodoButton]';

  navigateTo() {
    return cy.visit('/todos');
  }

  getUrl() {
    return cy.url();
  }


  /**
   * Gets the page title, which appears in the page tab
   *
   * @return the title of the component page
   */
  getPageTitle() {
    return cy.title();
  }

  /**
   * Gets the title of the app when visiting the `/todos` page.
   *
   * @returns the value of the element with the ID `.todo-list-title`
   */
  getTodoTitle() {
    return cy.get('.todo-list-title');
  }

  /**
   * Get all the `.todo-list-item` DOM elements.
   *
   * @returns an iterable (`Cypress.Chainable`) containing all
   *   the `.todo-list-item` DOM elements.
   */
  getTodoListItems() {
    return cy.get('.todo-nav-list .todo-list-item');
  }

  getTodoCards() {
    return cy.get('.todo-cards-container app-todo-card');
  }

  changeView(viewType: 'list' | 'card') {
    return cy.get(`${this.radioButtonSelector}[value="${viewType}"]`).click();
  }

  addTodoButton() {
    return cy.get(this.addTodoButtonSelector);
  }
}
