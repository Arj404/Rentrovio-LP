// Blog Pagination Component
const BlogPagination = {
  currentPage: 1,
  postsPerPage: 4,
  totalPosts: 0,

  init: function () {
    if (!document.querySelector('.blog-grid')) return; // Only initialize on blog page

    this.cacheElements();
    this.bindEvents();
    this.updatePostCount();
    this.showPage(1);
  },

  cacheElements: function () {
    this.blogGrid = document.querySelector('.blog-grid');
    this.blogPosts = document.querySelectorAll('.blog-post');
    this.paginationNumbers = document.querySelector('.pagination-numbers');
    this.prevButton = document.querySelector('.pagination-btn--prev');
    this.nextButton = document.querySelector('.pagination-btn--next');
  },

  bindEvents: function () {
    // Pagination events
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.showPage(this.currentPage - 1);
        }
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(this.getVisiblePosts().length / this.postsPerPage);
        if (this.currentPage < totalPages) {
          this.showPage(this.currentPage + 1);
        }
      });
    }
  },

  getVisiblePosts: function () {
    return Array.from(this.blogPosts);
  },

  showPage: function (pageNumber) {
    // Ensure pageNumber is valid
    const visiblePosts = this.getVisiblePosts();
    const totalPages = Math.ceil(visiblePosts.length / this.postsPerPage);

    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;

    this.currentPage = pageNumber;

    // Hide all posts
    this.blogPosts.forEach(post => {
      post.style.display = 'none';
    });

    // Show posts for current page
    const startIndex = (pageNumber - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const postsToShow = visiblePosts.slice(startIndex, endIndex);

    postsToShow.forEach(post => {
      post.style.display = 'block';
    });

    // Update pagination controls
    this.updatePaginationControls(totalPages);

    // Scroll to top of blog section
    const blogSection = document.querySelector('.blog-content-section');
    if (blogSection) {
      blogSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  },

  updatePaginationControls: function (totalPages) {
    // Update pagination numbers
    if (this.paginationNumbers) {
      this.paginationNumbers.innerHTML = '';

      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'pagination-number';
        if (i === this.currentPage) {
          pageButton.classList.add('pagination-number--active');
        }
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
          this.showPage(i);
        });
        this.paginationNumbers.appendChild(pageButton);
      }
    }

    // Update prev/next buttons
    if (this.prevButton) {
      this.prevButton.disabled = this.currentPage === 1;
      this.prevButton.classList.toggle('pagination-btn--disabled', this.currentPage === 1);
    }

    if (this.nextButton) {
      this.nextButton.disabled = this.currentPage === totalPages;
      this.nextButton.classList.toggle('pagination-btn--disabled', this.currentPage === totalPages);
    }
  },

  updatePostCount: function () {
    const visiblePosts = this.getVisiblePosts();
    this.totalPosts = visiblePosts.length;
  }
};

// Initialize blog pagination when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  BlogPagination.init();
});