// eslint-disable-next-line no-unused-vars
import photosDB from './photos.json';
// eslint-disable-next-line no-unused-vars
import friendsDB from './friends.json';

export default {
  getRandomElement(array) {
    if (!array.length) {
      return null;
    }
    const index = Math.round(Math.random() * (array.length - 1));
    return array[index];
  },

  getNextPhoto() {
    const friend = this.getRandomElement(friendsDB);
    const photoes = photosDB[friend.id];
    const photo = this.getRandomElement(photoes);
    return { friend: friend, url: photo.url };
  },
};
