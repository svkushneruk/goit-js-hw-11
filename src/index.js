import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImageSearchService from './js/api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const imageSearchService = new ImageSearchService();

const refs = {
  formEl: document.querySelector('.search-form'),
  searchBtn: document.querySelector('button[type="submit"]'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
  searchSection: document.querySelector('.search-section'),
};

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreBtnEl.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  hideLoadMoreBtn();
  clearGallery();
  imageSearchService.resetPage();
  imageSearchService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (imageSearchService.query === '') {
    Notify.failure('Please, enter your query.');
    return;
  }

  imageSearchService
    .fetchImages()
    .then(data => {
      if (data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notify.info(`Hooray! We found ${data.totalHits} images.`);

      const markup = createMarkup(data.hits);

      refs.galleryEl.insertAdjacentHTML('beforeend', markup);

      const lightbox = new SimpleLightbox('.gallery a', {});
      showLoadMoreBtn();
      if (data.hits.length > 0 && data.hits.length < 40) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        hideLoadMoreBtn();
      }
      moveToGallery();
    })
    .finally(() => {
      setTimeout(() => {
        const { height: cardHeight } =
          refs.galleryEl.firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }, 1000);
    });
}

function onLoadMore() {
  imageSearchService.fetchImages().then(data => {
    const markup = createMarkup(data.hits);
    refs.galleryEl.insertAdjacentHTML('beforeend', markup);
    const lightbox = new SimpleLightbox('.gallery a', {});
    if (data.hits.length > 0 && data.hits.length < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      hideLoadMoreBtn();
    }
  });
}

function moveToGallery() {
  const { height: sectionHeight } = refs.searchSection.getBoundingClientRect();
  window.scrollBy({
    top: sectionHeight,
  });
}

function createMarkup(data) {
  return data
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
                <a href="${largeImageURL}" class="big-img-link" >
                  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                </a>
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
