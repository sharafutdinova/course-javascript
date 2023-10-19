import model from './model.js';
import pages from './pages.js';
import profilePage from './profilePage.js';
import commentsTemplate from './commentsTemplate.html.hbs';

export default {
  async getNextPhoto() {
    const { friend, id, url } = await model.getNextPhoto();
    const photoStats = await model.photoStats(id);
    this.setFriendAndPhoto(friend, id, url, photoStats);
  },

  setFriendAndPhoto(friend, id, url, stats) {
    const photoComp = document.querySelector('.component-photo');
    const headerPhotoComp = document.querySelector('.component-header-photo');
    const headerNameComp = document.querySelector('.component-header-name');
    const footerPhotoComp = document.querySelector('.component-footer-photo');
    this.friend = friend;
    this.photoId = id;

    headerPhotoComp.style.backgroundImage = `url('${friend.photo_50}')`;
    headerNameComp.innerText = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;
    photoComp.style.backgroundImage = `url(${url})`;
    footerPhotoComp.style.backgroundImage = `url(${model.currentUser.photo_50})`;
    this.setLikes(stats.likes, stats.liked);
    this.setComments(stats.comments);
  },

  async loadComments(photo) {
    const comments = await model.getComments(photo);
    const commentsElements = commentsTemplate({
      list: comments.map((comment) => {
        return {
          name: `${comment.user.first_name ?? ''} ${comment.user.last_name ?? ''}`,
          photo: comment.user.photo_50,
          text: comment.text,
        };
      }),
    });
    document.querySelector('.component-comments-container-list').innerHTML = '';
    document.querySelector('.component-comments-container-list').append(commentsElements);
    this.setComments(comments.length);
  },

  setLikes(total, liked) {
    const likesElement = document.querySelector(
      '.component-footer-container-social-likes'
    );
    likesElement.innerText = total;
    if (liked) {
      likesElement.classList.add('liked');
    } else {
      likesElement.classList.remove('liked');
    }
  },

  setComments(total) {
    const likesElement = document.querySelector(
      '.component-footer-container-social-comments'
    );
    likesElement.innerText = total;
  },

  handleEvents() {
    let startFrom;

    document.querySelector('.component-photo').addEventListener('touchstart', (e) => {
      e.preventDefault();
      startFrom = { y: e.changedTouches[0].pageY };
    });

    document.querySelector('.component-photo').addEventListener('touchend', async (e) => {
      const direction = e.changedTouches[0].pageY - startFrom.y;

      if (direction < 0) {
        await this.getNextPhoto();
      }
    });

    document
      .querySelector('.component-footer-container-profile-link')
      .addEventListener('click', async () => {
        await profilePage.setUser(model.currentUser);
        pages.openPage('profile');
      });

    document
      .querySelector('.component-header-profile-link')
      .addEventListener('click', async () => {
        await profilePage.setUser(this.friend);
        pages.openPage('profile');
      });

    document
      .querySelector('.component-footer-container-social-likes')
      .addEventListener('click', async () => {
        const { likes, liked } = await model.like(this.photoId);
        this.setLikes(likes, liked);
      });

    document
      .querySelector('.component-footer-container-social-comments')
      .addEventListener('click', async () => {
        document.querySelector('.component-comments').classList.remove('hidden');
        await this.loadComments(this.photoId);
      });

    const input = document.querySelector('.component-comments-container-form-input');
    document.querySelector('.component-comments').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        document.querySelector('.component-comments').classList.add('hidden');
      }
    });

    document
      .querySelector('.component-comments-container-form-send')
      .addEventListener('click', async () => {
        if (input.value.trim().length) {
          await model.postComment(this.photoId, input.value.trim());
          input.value = '';
          await this.loadComments(this.photoId);
        }
      });
  },
};
