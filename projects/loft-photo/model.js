// eslint-disable-next-line no-unused-vars
import photosDB from './photos.json';
// eslint-disable-next-line no-unused-vars
import friendsDB from './friends.json';

export default {
  getRandomElement(array) {
    if (!array.length) {
      return null;
    }
    return array(parseInt(Math.random() * array.length));
  },
  getNextPhoto() {
    const friend = this.getRandomElement(friendsDB);
    const photoesFriends = photosDB.get(friend.id);
    const photo = this.getRandomElement(photoesFriends);
    return { friend: friend, url: photo.url };
  },
};
