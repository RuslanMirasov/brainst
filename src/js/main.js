'use strict';

//---------------------------------------------------------------------------- НАСТРОЙКИ
const domen = 'https://brainst.pro/';
let currentPage = 1;
let currentCategory = 'all';
let limit = 6;

const categories = [];
const showMoreWorksButton = document.querySelector('.js-show-more-works');
const worksList = document.querySelector('.worksList');
const categoriesList = document.querySelector('.works__categorys');
const servicesList = document.querySelector('.servicesList');
//---------------------------------------------------------------------------------------

if (showMoreWorksButton) {
  showMoreWorksButton.addEventListener('click', loadMoreWorks);
}

if (categoriesList) {
  categoriesList.addEventListener('click', filterCategory);
}

//ФИЛЬТР
function filterCategory(e) {
  e.preventDefault();
  if (e.target.classList.contains('js-show-category')) {
    e.target.classList.add('isLoading');
    const categoryId = e.target.dataset.id;
    currentPage = 1;
    currentCategory = categoryId;
    fetchWorks(categoryId, limit, currentPage)
      .then(response => {
        worksList.innerHTML = '';
        e.target.classList.remove('isLoading');
        const categoryButton = document.querySelectorAll('.worksBtn');
        categoryButton.forEach(btn => {
          btn.classList.remove('active');
        });
        e.target.classList.add('active');
        if (response.length < limit) {
          showMoreWorksButton.classList.add('hidden');
        } else {
          showMoreWorksButton.classList.remove('hidden');
          showMoreWorksButton.classList.remove('isLoading');
        }
        renderWorks(response);
      })
      .catch(error => {
        e.target.classList.remove('isLoading');
        console.log(error);
      });
  }
}

// РЕНДЕР РАБОТ ПРИ ЗАГРУЗКЕ
if (worksList) {
  fetchWorks(currentCategory, limit, currentPage)
    .then(response => {
      renderWorks(response);
    })
    .catch(error => {
      console.log(error);
    });
}

// РЕНДЕР КАТЕГОРИЙ ПРИ ЗАГРУЗКЕ
if (categoriesList) {
  fetcCategories()
    .then(response => {
      renderCategories(response);
      renderServices(response);
    })
    .catch(error => {
      console.log(error);
    });
}

// ЗАГРУЗИТЬ БОЛЬШЕ РАБОТ ПРИ КЛИКЕ НА КНОПКУ
function loadMoreWorks() {
  showMoreWorksButton.classList.add('isLoading');
  currentPage += 1;
  fetchWorks(currentCategory, limit, currentPage)
    .then(response => {
      renderWorks(response);
      showMoreWorksButton.classList.remove('isLoading');
      if (response.length < limit) {
        showMoreWorksButton.classList.add('hidden');
      }
    })
    .catch(error => {
      console.log(error);
      showMoreWorksButton.classList.add('hidden');
    });
}

//------------------------------------------------------

//РЕНДЕР РАЗМЕТКИ РАБОТ
function renderWorks(works) {
  const worksMarkup = works.map(({ link, title, category, yoast_head_json }) => {
    return ` 
      <li class="worksList__item scroll-animate__fade">
        <a href="${link}" class="work" target="_blank">
          <img src="${yoast_head_json.og_image[0].url}" alt="${category}" />
          <p class="work__categoty">${category.map(id => {
            if (categories[id]) {
              return ` ${categories[id]}`;
            }
          })}</p >
          <h3 class="text-repeater">
            <span>${title.rendered}&nbsp;<span>${title.rendered}&nbsp;</span></span>
          </h3>
        </a>
      </li>
      `;
  });
  worksList.insertAdjacentHTML('beforeend', worksMarkup.join(''));
}

//РЕНДЕР РАЗМЕТКИ ФИЛЬТРА КАТЕГОРИЙ
function renderCategories(сategories) {
  const categoriesMarkup = сategories.map(({ id, name }) => {
    if (name !== 'Uncategorized') {
      categories[id] = name;
      return `<li><button data-id="${id}" class="worksBtn js-show-category">${name}</button></li>`;
    }
  });
  categoriesList.insertAdjacentHTML('beforeend', categoriesMarkup.join(''));
}

//РЕНДЕР РАЗМЕТКИ СПИСКА КАТЕГОРИЙ
function renderServices(services) {
  const servicesMarkup = services.map(({ id, name }, index) => {
    if (name !== 'Uncategorized') {
      var number = index;
      if (index < 10) {
        number = `0${index}`;
      }
      return `
      <div class="servicesList__item">
				<strong>${number}</strong>
				<p>${name}</p>
			</div>`;
    }
  });
  servicesList.insertAdjacentHTML('beforeend', servicesMarkup.join(''));
}

//СБОР РАБОТ ИЗ БАЗЫ
async function fetchWorks(categoryId, limit, page) {
  let category = '';
  if (categoryId !== 'all') {
    category = `category=${categoryId}`;
  }
  return fetch(`${domen}wp-json/wp/v2/works?${category}&per_page=${limit}&page=${page}`).then(response => {
    return response.json();
  });
}

//СБОР РАБОТ (ПО КАТЕГОРИИ) ИЗ БАЗЫ
async function fetchWorksByCategory(categoryId, limit, page) {
  return fetch(`${domen}wp-json/wp/v2/works?category=${categoryId}&per_page=${limit}&page=${page}`).then(response => {
    return response.json();
  });
}

//СБОР КАТЕГОРИЙ ИЗ БАЗЫ
async function fetcCategories() {
  return fetch(`${domen}wp-json/wp/v2/category`).then(response => {
    return response.json();
  });
}
