import model from './model.js';
import pages from './pages.js';
import mainPage from './mainPage.js';

export default {
  handleEvents() {
    document.querySelector('.page-login-button').addEventListener('click', async () => {
      await model.login();
      await model.init();

      pages.openPage('main');
      await mainPage.getNextPhoto();
    });
  },
};
