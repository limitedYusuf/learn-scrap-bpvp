new Vue({
  el: '#app',
  data() {
    return {
      url: 'https://www.scrapethissite.com/pages/simple/',
      tags: ['.country-name', '.country-capital', '.country-population', '.country-area'],
      loading: false,
      scrapedData: [],
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.scrapedData.slice(start, end);
    }
  },
  methods: {
    addTag() {
      this.tags.push('');
    },
    removeTag(index) {
      this.tags.splice(index, 1);
    },
    async scrapeData() {
      this.loading = true;
      this.scrapedData = [];
      this.currentPage = 1;

      try {
        const response = await axios.post('/scrape', {
          url: this.url,
          tags: this.tags
        });

        this.scrapedData = response.data;
      } catch (error) {
        console.error('Error scraping data:', error);
        this.scrapedData = [{ 'Error': 'Failed to fetch data.' }];
      }

      this.loading = false;
    },
    nextPage() {
      if ((this.currentPage * this.pageSize) < this.scrapedData.length) {
        this.currentPage += 1;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    }
  }
});