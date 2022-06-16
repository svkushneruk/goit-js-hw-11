import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImageSearchService from './css/js/api';

const imageSearchService = new ImageSearchService();

const refs = {
  formEl: document.querySelector('.search-form'),
  searchBtn: document.querySelector('button[type="submit"]'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreBtnEl.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  hideLoadMoreBtn();
  clearGallery();
  imageSearchService.resetPage();
  imageSearchService.query = e.currentTarget.elements.searchQuery.value;
  if (imageSearchService.query === '') {
    return;
  }
  imageSearchService.fetchImages().then(data => {
    console.log(data);
    if (data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    const template = data.hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
            <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b> Likes</b> ${likes}
                    </p>
                    <p class="info-item">
                        <b> Views</b> ${views}
                    </p>
                    <p class="info-item">
                        <b> Comments</b> ${comments}
                    </p>
                    <p class="info-item">
                        <b> Downloads</b> ${downloads}
                    </p>
                </div>
            </div>
            `;
        }
      )
      .join('');
    refs.galleryEl.insertAdjacentHTML('beforeend', template);
    showLoadMoreBtn();
    if (data.hits.length > 0 && data.hits.length < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      hideLoadMoreBtn();
    }
  });
}

function onLoadMore() {
  imageSearchService.fetchImages().then(data => {
    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const template = data.hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
            <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b> Likes</b> ${likes}
                    </p>
                    <p class="info-item">
                        <b> Views</b> ${views}
                    </p>
                    <p class="info-item">
                        <b> Comments</b> ${comments}
                    </p>
                    <p class="info-item">
                        <b> Downloads</b> ${downloads}
                    </p>
                </div>
            </div>
            `;
        }
      )
      .join('');
    refs.galleryEl.insertAdjacentHTML('beforeend', template);
    if (data.hits.length > 0 && data.hits.length < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      hideLoadMoreBtn();
    }
  });
}

function showLoadMoreBtn() {
  refs.loadMoreBtnEl.classList.remove('visually-hidden');
}
function hideLoadMoreBtn() {
  refs.loadMoreBtnEl.classList.add('visually-hidden');
}

function clearGallery() {
  refs.galleryEl.innerHTML = '';
}
