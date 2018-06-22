import './styles.scss';
import scrollama from 'scrollama';

const timelineDots = document.querySelectorAll('.timeline__circle');

const offset = 140;

// Trigger sticky header
window.addEventListener('scroll', () => {
  const containerHeight =
    document.querySelector('#timeline-wrapper').getBoundingClientRect().bottom -
    document.querySelector('#timeline-wrapper').getBoundingClientRect().top;

  const containerPosition = document.querySelector('#timeline-wrapper').offsetTop + containerHeight;

  if (window.scrollY - window.innerHeight > containerPosition) {
    document.querySelector('#timeline-container').classList.add('tacked');
    document.querySelector('.timeline-legend').classList.remove('hide');
  } else {
    document.querySelector('#timeline-container').classList.remove('tacked');
    document.querySelector('.timeline-legend').classList.add('hide');
  }
});

// Add click events to timeline circles
Array.from(timelineDots).forEach((timelineDot) => {
  timelineDot.addEventListener('click', () => {
    const id = timelineDot.dataset.cardId;
    const yPos =
      document.querySelector(`#tariffs-${id}`).getBoundingClientRect().top +
      window.scrollY -
      offset -
      20;

    window.scrollTo(0, yPos);
  });
});

const circles = document.querySelectorAll('.timeline__circle');

function clearCirclesExcept(id) {
  circles.forEach((circle) => {
    if (circle.dataset.cardId !== id) {
      circle.classList.remove('selected');
    }
  });
}

// Add scroll triggers to date sections
const scroller = scrollama();

scroller
  .setup({
    step: '.date-step',
    offset: 0.2,
    progress: true,
  })
  .onStepEnter((trigger) => {
    document.querySelector('#timeline-container').classList.add('tacked');
    document.querySelector('.timeline-legend').classList.remove('hide');

    const id = trigger.element.dataset.cardId;
    const countryName = trigger.element.dataset.countryName === 'us' ? 'us' : 'chinese';

    const circle = document.querySelector(`.timeline__circle[data-card-id="${id}"`);
    circle.classList.add('selected');
    clearCirclesExcept(id);

    const countryIcon = document.querySelector('.legend-country .summary-item');
    countryIcon.classList.remove('item__us');
    countryIcon.classList.remove('item__china');
    countryIcon.classList.add(`item__${countryName}`);
  })
  .onStepExit((trigger) => {
    const id = trigger.element.dataset.cardId;
    const circle = document.querySelector(`.timeline__circle[data-card-id="${id}"`);
    if (
      trigger.index !== 0 &&
      trigger.direction !== 'up' &&
      (trigger.index !== circles.length - 1 && trigger.direction !== 'down')
    ) {
      circle.classList.remove('selected');
    }
  });

window.addEventListener('resize', () => {
  scrollama.resize();
});
