describe('App teste', () => {
  it('Verifica se o pop-up de validação "Preencha este campo." é exibido', () => {
    cy.visit('http://localhost:5173/login');
    cy.get('.px-4').click();
    cy.get('#email').then(($input) => {
      expect($input[0].checkValidity()).to.be.false;
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
    cy.get('#email').type('ana@fatura.com');
    cy.get('#password').type('123456');
    cy.get('button').contains('Entrar').click();
    cy.url().should('eq', 'http://localhost:5173/menu');
  });

  it('Verifica se o login falha com credenciais inválidas', () => {
    cy.visit('http://localhost:5173/login');
    cy.get('#email').type('usuario@inexistente.com');
    cy.get('#password').type('senhaErrada');
    cy.get('button').contains('Entrar').click();

    // Verifica que continua na tela de login
    cy.url().should('eq', 'http://localhost:5173/login');

    // Se houver alguma mensagem de erro visível
    cy.contains('Email ou senha inválidos. Por favor, verifique suas credenciais.').should('be.visible'); 
  });
});
