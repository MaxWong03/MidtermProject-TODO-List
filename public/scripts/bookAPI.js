$(() => {
  $('.read-todos').on('click', () => {
    const list = todos.filter(todo => todo.category_id === 3);
    renderTodos(list);
    const slider = $('.carousel');
    slider.empty();
    const bookPromise = [];
    list.forEach((task) => {
      bookPromise.push($.ajax('api/widgets/book', {
        method: 'POST',
        data: task.title,
        beforeSend: function() {
          $('.preloader-wrapper').css('display', 'block');
        },
        complete: function() {
          $('.preloader-wrapper').css('display', 'none');
        }
      }));
    });
    Promise.all(bookPromise)
      .then(books => {
        books.forEach(book => {
          slider.append(`
          <div class="row carousel-item">
          <div class="col s12 m12">
          <div class="card food">
          <div class="card-image waves-effect waves-block waves-light">
            <img class="activator" src="${book.thumbnail}">
          </div>
          <div class="card-content">
        <span class="card-title activator grey-text text-darken-4" style="text-align: center"><p class="book-title">${book.title}</p><i class="material-icons left" style="transform: translateY(-100%);">check_circle</i><i class="material-icons right" style="transform: translateY(-100%);">cancel</i></span>
          </div>
          <div class="card-reveal">
          <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
          <p class="hidden-card-content">Here is some more information about this product that is only revealed once clicked on.</p>
          </div>
          </div>
          </div>
        </div>
          `);
        });
        slider.carousel({
          onCycleTo: function (data) {
            const currentBook = $(data).find('.book-title').html();
            $.ajax('api/widgets/bookInfo', { method: 'POST', data: currentBook })
              .then(bookInfo => {
                $('.hidden-card-content').html(`
                    <h5 class="genre">Authors: ${bookInfo.authors}</h3>
                    <h5 class="type">Page Count: ${bookInfo.pageCount}</h3>
                    <h5 class="plot">About: ${bookInfo.textSnippet}</h4>
                    <h5 class="categoryt">Categories: ${bookInfo.categories}</h4>
                    <h5 class="year">Published Date: ${bookInfo.publishedDate}</h5>
                    <h5 class="rating">Avg Rating: ${generateStars(bookInfo.averageRating, 5)}</h5>
                    <h5 class="rating-count">Rating Count: ${bookInfo.ratingsCount}</h5>
                    `);
              });
          }
        });
      });
  });
});
