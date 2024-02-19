import { TodoListPage } from "cypress/support/todo-list.po";

const page = new TodoListPage();

describe('Todo list', () => {

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct page title', () => {
    page.getPageTitle().should('eq', 'Todos');
  });

  it('Should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Todos');
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {

    cy.get('[data-test=todoOwnerInput]').type('Fry');

    page.getTodoListItems().each($todo => {
      cy.wrap($todo).find('.todo-list-owner').should('contain', 'Fry');
    });

    page.getTodoListItems().find('.todo-list-owner').each($owner =>
      expect($owner.text()).to.equal('Fry')
    );
  });

  it('Should type partial name in the owner filter and check that it returned correct elements', () => {

    cy.get('[data-test=todoOwnerInput]').type('Fr');

    page.getTodoListItems().each($todo => {
      cy.wrap($todo).find('.todo-list-owner').should('contain', 'Fry');
    });
  });

  it('Should type something in the contains filter and check that it returned correct elements', () => {

    cy.get('[data-test=todoBodyInput]').type('sit');


    page.getTodoListItems().find('.todo-list-body').each($body =>
      expect($body.text().toLowerCase()).to.contain('sit')
    );
  });

  it('Should select a category and check that it returned correct elements', () => {
    cy.get('[data-test=todoCategorySelect]').click()
    .get(`mat-option[value="groceries"]`).click();

    page.getTodoListItems().each($todo => {
      cy.wrap($todo).find('.todo-list-category').should('contain', 'Groceries');
    });

  });

  it('Should select a status and check that it returned correct elements', () => {
    cy.get('[data-test=todoStatusSelect]').click()
    .get(`mat-option[id="true"]`).click();

    page.getTodoListItems().each($todo => {
      cy.wrap($todo).find('.todo-list-status').should('contain', 'Complete');
    });

  });

  it('Should select a status, select a category, type an owner, and check that it returned correct elements', () => {
    cy.get('[data-test=todoStatusSelect]').click()
    .get(`mat-option[id="false"]`).click();

    cy.get('[data-test=todoCategorySelect]').click()
    .get(`mat-option[value="video games"]`).click();

    cy.get('[data-test=todoOwnerInput]').type('Blanche');

    page.getTodoListItems().each($todo => {
      cy.wrap($todo).find('.todo-list-status').should('contain', 'Incomplete');
      cy.wrap($todo).find('.todo-list-category').should('contain', 'Video Games');
      cy.wrap($todo).find('.todo-list-owner').should('contain', 'Blanche');
    });

  });

  it('Should type something in the Owner filter and check that it returned correct elements', () => {
    page.changeView('card');
    // Filter for user 'Fry'
    cy.get('[data-test=todoOwnerInput]').type('Fry');

    // All of the user cards should have the name we are filtering by
    page.getTodoCards().should('have.lengthOf.above', 0);
  });

  it('Should type something in the Status filter and check that it returned correct elements', () => {
    page.changeView('card');
    // Filter for status 'complete'
    cy.get('[data-test=todoStatusSelect]').type('complete');

    page.getTodoCards().should('have.lengthOf.above', 0);
  });

  it('Should type something in the Category filter and check that it returned correct elements', () => {
    page.changeView('card');
    // Filter for category 'homework'
    cy.get('[data-test=todoCategorySelect]').type('homework');

    page.getTodoCards().should('have.lengthOf.above', 0);
  });

  it('Should type something in the Body filter and check that it returned correct elements', () => {
    page.changeView('card');
    // Filter for body 'qui'
    cy.get('[data-test=todoBodyInput]').type('qui');

    page.getTodoCards().should('have.lengthOf.above', 0);
  });

});
