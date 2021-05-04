import images from './gallery-items.js'

const imagesContainer = document.querySelector('.js-gallery')
const isModalEl = document.querySelector('.js-lightbox')
const isBtnCloseEl = document.querySelector('.lightbox__button')
const modalImageEl = document.querySelector('.lightbox__image')
const backdropOverlayEl = document.querySelector('.lightbox__overlay')

const imagesMarkup = createImageCardsMarkup(images)

imagesContainer.addEventListener('click', onImagesContainerClick)
isBtnCloseEl.addEventListener('click', onCloseModal)
backdropOverlayEl.addEventListener('click', onBackdropClick)

imagesContainer.insertAdjacentHTML('beforeend', imagesMarkup.join(''))

function createImageCardsMarkup(images) {
  return images.map(({ preview, original, description }, index) => {
    return `
  <li class="gallery__item">
   <a
     class="gallery__link"
     href="${original}"
   >
     <img
       loading="lazy"
       class="gallery__image"
       data-src="${preview}"
       data-source="${original}"
       data-index="${index}"
       alt="${description}"
       height=240
     />
   </a>
  </li>
  `
  })
}

function onImagesContainerClick(evt) {
  evt.preventDefault()
  const isImagesEl = evt.target.classList.contains('gallery__image')
  if (!isImagesEl) {
    return
  }

  isModalEl.classList.add('is-open')
  window.addEventListener('keydown', onEscKeyPress)
  modalImageEl.src = evt.target.dataset.source
  modalImageEl.alt = evt.target.alt
  modalImageEl.dataset.index = evt.target.dataset.index
  window.addEventListener('keydown', (event) =>
    onArrowKeyPress(event, modalImageEl)
  )
}

function onCloseModal() {
  isModalEl.classList.remove('is-open')
  modalImageEl.removeAttribute('src')
  modalImageEl.removeAttribute('alt')
  window.removeEventListener('keydown', onEscKeyPress)
  window.removeEventListener('keydown', onArrowKeyPress)
}

function onBackdropClick(event) {
  if (event.currentTarget === event.target) {
    onCloseModal()
  }
}

function onEscKeyPress(event) {
  if (event.code === 'Escape') {
    onCloseModal()
  }
}

function onArrowKeyPress(event, image) {
  const index = parseInt(image.dataset.index)
  if (event.code === 'ArrowRight') {
    if (index !== images.length - 1) {
      modalImageEl.src = images[index + 1].original
      modalImageEl.alt = images[index + 1].description
      modalImageEl.dataset.index = index + 1
    } else {
      modalImageEl.src = images[0].original
      modalImageEl.alt = images[0].description
      modalImageEl.dataset.index = 0
    }
  }
  if (event.code === 'ArrowLeft') {
    if (index !== 0) {
      modalImageEl.src = images[index - 1].original
      modalImageEl.alt = images[index - 1].description
      modalImageEl.dataset.index = index - 1
    } else {
      modalImageEl.src = images[images.length - 1].original
      modalImageEl.alt = images[images.length - 1].description
      modalImageEl.dataset.index = images.length - 1
    }
  }
}

if ('loading' in HTMLImageElement.prototype) {
  const LazyImages = document.querySelectorAll('img[loading="lazy"]')
  LazyImages.forEach((img) => {
    img.src = img.dataset.src
  })
} else {
  const script = document.createElement('script')
  script.src =
    'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js'
  script.integrity =
    'sha512-q583ppKrCRc7N5O0n2nzUiJ+suUv7Et1JGels4bXOaMFQcamPk9HjdUknZuuFjBNs7tsMuadge5k9RzdmO+1GQ=='
  script.crossorigin = 'anonymous'
}
