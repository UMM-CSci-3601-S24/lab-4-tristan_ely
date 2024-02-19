
export class TodoListPage {
  private readonly baseUrl = '/users';
  private readonly pageTitle = '.user-list-title';
  private readonly userCardSelector = '.user-cards-container app-user-card';
  private readonly userListItemsSelector = '.user-nav-list .user-list-item';
  private readonly profileButtonSelector = '[data-test=viewProfileButton]';
  private readonly radioButtonSelector = `[data-test=viewTypeRadio] mat-radio-button`;
  private readonly userRoleDropdownSelector = '[data-test=userRoleSelect]';
  private readonly dropdownOptionSelector = `mat-option`;
  private readonly addUserButtonSelector = '[data-test=addUserButton]';

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
}
