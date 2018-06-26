import './styles.scss';
import scrollama from 'scrollama';
import * as d3TimeFormat from 'd3-time-format';

const timelineDots = document.querySelectorAll('.timeline__circle');

const offset = 140;

const parseTime = d3TimeFormat.timeParse('%Y-%m-%d');
const getMonth = d3TimeFormat.timeFormat('%B');
const getDay = d3TimeFormat.timeFormat('%e');

// Trigger sticky header
window.addEventListener('scroll', () => {
  const containerHeight =
    document.querySelector('#timeline-wrapper').getBoundingClientRect().bottom -
    document.querySelector('#timeline-wrapper').getBoundingClientRect().top;

  const containerPosition = document.querySelector('#timeline-wrapper').offsetTop + containerHeight;

  if (window.scrollY > containerPosition) {
    // Add sticky header on scroll
    document.querySelector('#timeline-container').classList.add('tacked');
  } else {
    // Remove sticky header
    document.querySelector('#timeline-container').classList.remove('tacked');
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
  });

  timelineDot.addEventListener('mouseover', () => {
    const id = timelineDot.dataset.cardId;
    const textRight = document.querySelector('.timeline__line-text-right');
    textRight.style.display = 'inline';

    const time = parseTime(id);
    const displayString = `${getMonth(time)} ${getDay(time).trim()}`;

    textRight.innerText = displayString;
  });

  timelineDot.addEventListener('mouseout', () => {
    const textRight = document.querySelector('.timeline__line-text-right');
    textRight.style.display = 'none';
  });
});

const idList = Array.from(timelineDots).map(c => c.dataset.cardId);

function clearCirclesExcept(id) {
  timelineDots.forEach((circle) => {
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
    offset: 0.175,
    progress: true,
  })
  .onStepEnter((trigger) => {
    // If page refreshed, add sticky header
    document.querySelector('#timeline-container').classList.add('tacked');

    const id = trigger.element.dataset.cardId;
    const countryName = trigger.element.dataset.countryName === 'us' ? 'us' : 'chinese';

    // Highlight selected timeline circle
    const circle = document.querySelector(`.timeline__circle[data-card-id="${id}"`);
    circle.classList.add('selected');
    clearCirclesExcept(id);

    // Get current date, previous id, and next id
    const currentIndex = idList.indexOf(id);
    const prevIndex = currentIndex === 0 ? 0 : currentIndex - 1;
    const nextIndex = currentIndex < idList.length - 1 ? currentIndex + 1 : currentIndex;

    // Set data
    const time = parseTime(id);
    const timeString = `${getMonth(time)} ${getDay(time).trim()}`;
    const value = trigger.element.dataset.cardValue;

    document.querySelector('.timeline__line-date').innerText = timeString;
    document.querySelector('.timeline__line-value').innerText = `$${value}bn`;
  })
  .onStepExit((trigger) => {
    const id = trigger.element.dataset.cardId;
    const circle = document.querySelector(`.timeline__circle[data-card-id="${id}"`);
    if (
      trigger.index !== 0 &&
      trigger.direction !== 'up' &&
      (trigger.index !== timelineDots.length - 1 && trigger.direction !== 'down')
    ) {
      // Remove selected timeline circled
      circle.classList.remove('selected');
    }
  });

window.addEventListener('resize', () => {
  scrollama.resize();
});
