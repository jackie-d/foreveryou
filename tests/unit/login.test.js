import { beforeEach } from 'node:test';
import loginModule from '../../js/pages/login.js';

const getAuth = jest.fn().mockImplementation(() => {
    return {
        default: jest.fn(() => true)
    }
});
const signInWithEmailAndPassword = jest.fn().mockImplementation(() => {
    return {
        default: jest.fn(() => true)
    }
});
const createUserWithEmailAndPassword = jest.fn().mockImplementation(() => {
    return {
        default: jest.fn(() => true)
    }
});
const GoogleAuthProvider = jest.fn().mockImplementation(() => {
    return {
        default: jest.fn(() => true)
    }
});
const signInWithPopup = jest.fn().mockImplementation(() => {
    return {
        default: jest.fn(() => true)
    }
});

describe('test login controller', () => {

    beforeEach(() => {
        
    });

    test('login init UI UX', () => {

        let clickCount = 0;

        $ = () => { 
            return {
                default: () => {return this},
                click: (el) => clickCount++
            }
        };

        loginModule.init(undefined);

        expect(clickCount).toBe(3);
    });

});
