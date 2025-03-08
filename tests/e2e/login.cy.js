describe('Login page', () => {
    it('Page loads with basic elements', () => {
      cy.visit('http://127.0.0.1:5500/login.html');

      cy.get('input#email')
      cy.get('input#password')
      cy.get('a#loginButton')
      cy.get('button#login-button-google')
    })

    it('Page submits with filled wrong data', () => {
        cy.visit('http://127.0.0.1:5500/login.html');
  
        cy.get('input#email').type('user@example.com')
        cy.get('input#password').type('password')

        // TO-DO: throw error by chainable to fail this test
        cy.on('window:alert', (str) => {
            if ( str && !str.indexOf('auth/invalid-login-credentials') ) {
                throw new Error('Wrong response error message');
            }
        })

        cy.get('a#loginButton').click();
        cy.wait(5000);
      })

      it('Page doesnt submit without filled email data', () => {
        cy.visit('http://127.0.0.1:5500/login.html');
  
        cy.get('input#email').clear()
        cy.get('input#password').clear()

        // TO-DO: throw error by chainable to fail this test
        cy.on('window:alert', (str) => {
            if ( str && !str.indexOf('auth/invalid-email') ) {
                throw new Error('Wrong response error message');
            }
        })

        cy.get('a#loginButton').click();
        cy.wait(5000);
      })
  })