const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  if (images.length) {
    document.getElementById("error-message").style.display = "none";
    imagesArea.style.display = "block";
    gallery.innerHTML = "";
    // show gallery title
    galleryHeader.style.display = "flex";
    images.forEach((image) => {
      let div = document.createElement("div");
      div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    });
  } else {
    errorMessage();
    imagesArea.style.display = "none";
    document.getElementById("error-message").style.display = "block";
  }
  document.querySelector(".images").value = "";
  displaySpinner();
};

const getImages = (query) => {
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => showImages(data.hits))
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  // element.classList.add("added");
  element.classList.toggle("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
  }
};
var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image aria
  imagesArea.style.display = "none";
  const timeInput = document.getElementById("duration").value;
  let duration = 0;
  if (timeInput > 0) {
    duration = timeInput;
  };
  if(timeInput < 0){
    alert("Set a valid value!")
    return;
  }
  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration || 1000);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

searchBtn.addEventListener("click", function () {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  getImages(search.value);
  sliders.length = 0;
  displaySpinner();
});

sliderBtn.addEventListener("click", function () {
  createSlider();
});

//function for enabling "Enter" key
document.getElementById("search").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

const positiveNumberValidation = (input) => {
  let regex = /[^0-9]/gi;
  input.value = input.value.replace(regex, "");
};

//disable up and down arrow keys for stopping incrementing by keys
document.getElementById("duration").addEventListener("keydown", function (e) {
  if (e.key.charCodeAt() === 65 || e.key.charCodeAt() === 65) {
    e.preventDefault();
  }
});

//function for displaying spinners
const displaySpinner = () => {
  const spinner = document.getElementById("spinner");
  const imageSection = document.getElementById("image-section");
  spinner.classList.toggle("d-none");
  imageSection.classList.toggle("d-none");
};

const errorMessage = () => {
  const errorMessageDiv = document.getElementById("error-message");

  errorMessageDiv.innerHTML = ` 
    <div class="card not-found" style="width: 18rem">
      <h5>Something went wrong! Please try again with a valid search value.</h5>
    </div>`;
};
