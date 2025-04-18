describe ('App teste',()=>{

    it('Verifica se o pop-up de validação "Preencha este campo." é exibido', () => {
        cy.visit('http://localhost:5173/login');
        cy.get(':nth-child(3) > .flex').click();
        cy.get('#email').then(($input) => {
        
        // Confirma que o campo está inválido (o que indica que o pop-up de validação foi disparado)
        expect($input[0].checkValidity()).to.be.false;
        // Verifica se a mensagem de validação é "Preencha este campo."
        expect($input[0].validationMessage).to.equal('Preencha este campo.');
        });
    });


    it('Verifica se o email é válido ao digitar "teste"', () => {
        cy.visit('http://localhost:5173/login');
        cy.get('#email').type('teste');
        cy.get('#password').type('senha123');
        cy.get('button').contains('Entrar').click();
        cy.get('#email').then(($input) => {
          cy.log('Mensagem de validação:', $input[0].validationMessage);
          expect($input[0].checkValidity()).to.be.false;
          expect($input[0].validationMessage).to.equal('Inclua um "@" no endereço de email. "teste" não contém um "@".');
        });
      });
        

      it('Verifica se o login é realizado com sucesso', () => {
        cy.visit('http://localhost:5173/login');
        cy.get('#email').type('usuario@dominio.com');
        cy.get('#password').type('senha123');
        cy.get('button').contains('Entrar').click();
        cy.url().should('eq', 'http://localhost:5173/menu');
      });



});
    