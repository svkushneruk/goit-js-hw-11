import axios from 'axios';

const API_KEY = '28095599-4638dd4a9a44e9c8a84be8988';

export default class ImageSearchService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  async fetchImages() {
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?key=28095599-4638dd4a9a44e9c8a84be8988&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
      );
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
