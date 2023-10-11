import pages from './pages.js';
import mainPage from './mainPage.js';
import loginPage from './loginPage.js';
import profilePage from './profilePage.js';

import('./styles.css');

pages.openPage('login');
loginPage.handleEvents();
mainPage.handleEvents();
profilePage.handleEvents();
