/*
describe ('App teste',()=>{

    describe('App teste', () => {
  
        it('Verifica se o pop-up de validação "Preencha este campo." é exibido', () => {
          cy.visit('http://localhost:5173/createuser');
      
          // Mockando a resposta da API antes do clique
          cy.intercept('POST', 'http://localhost:3000/api/users', {
            statusCode: 201,
            body: { 
              firstname: "Ana Luiza", 
              lastname: "da Silva", 
              email: "analuiza@fake", 
              password: "senha123" 
            }
          }).as('loginRequest');
      
          // Preenche os campos do formulário
          cy.get('#firstName').type("Ana Luiza");
          cy.get('#lastName').type("da Silva");
          cy.get('#email').type("analuiza@fake");
          cy.get('#password').type("senha123");
          
          // Clica no botão de criação de usuário
          cy.get('.mt-10 > .block').click();
      
          // Aguarda a requisição e verifica a resposta mockada
          cy.wait('@loginRequest').its('response.statusCode').should('eq', 201);
        });
      
      });
      
});
*/