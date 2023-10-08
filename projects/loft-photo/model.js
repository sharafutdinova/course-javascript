/* eslint-disable no-undef */
const PERM_FRIENDS = 2;
const PERM_PHOTOS = 4;
// const APP_ID = 51765642;

VK.init({
  apiId: 51765642,
});

export default {
  getRandomElement(array) {
    if (!array.length) {
      return null;
    }
    const index = Math.round(Math.random() * (array.length - 1));
    return array[index];
  },

  async getNextPhoto() {
    const friend = this.getRandomElement(this.friends.items);
    const photos = await this.getFriendPhotos(friend.id);
    const photo = this.getRandomElement(photos.items);
    const size = this.findSize(photo);

    return { friend, id: photo, url: size.url };
  },
  findSize(photo) {
    const size = photo.sizes.find((size) => size >= 360);

    if (!size) {
      return photo.sizes.reduce((biggest, current) => {
        if (current.width > biggest.width) {
          return current;
        }

        return biggest;
      }, photo.sizes[0]);
    }

    return size;
  },

  login() {
    return new Promise((resolve, reject) => {
      VK.Auth.login((response) => {
        if (response.session) {
          resolve(response);
        } else {
          console.error(response);
          reject(response);
        }
      }, PERM_FRIENDS | PERM_PHOTOS);
    });
  },
  callAPI(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
      VK.api(method, params, (data) => {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.response);
        }
      });
    });
  },

  usersCache: null,
  async init() {
    this.photoCache = {};
    this.friends = await this.getFriends();
  },

  getFriends() {
    const params = {
      fields: ['photo_50', 'photo_100'],
    };

    return this.callApi('friends.get', params);
  },

  getPhotos(owner) {
    const params = {
      owner_id: owner,
    };

    return this.callApi('photos.getAll', params);
  },

  photoCache: {},

  async getFriendPhotos(id) {
    const photos = this.photoCache[id];

    if (photos) {
      return photos;
    }

    await this.getPhotos(id);
    // const photos = вместо этого комментария вставьте код для получения фотографии друга из ВК

    this.photoCache[id] = photos;

    return photos;
  },
};
