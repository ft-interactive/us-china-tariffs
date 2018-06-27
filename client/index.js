import './styles.scss';
import scrollama from 'scrollama';
import * as d3TimeFormat from 'd3-time-format';

const timelineDots = document.querySelectorAll('.timeline__circle');

// Calculate ratio for scrolling
let ratio =
  document.querySelector('#timeline-container').getBoundingClientRect().height / window.innerHeight;

if (ratio > 0.2) {
  ratio *= 1.15;
}

const parseTime = d3TimeFormat.timeParse('%Y-%m-%d');
const getMonth = d3TimeFormat.timeFormat('%B');
const getDay = d3TimeFormat.timeFormat('%e');

function scrollToId(id) {
  const yPos =
    document.querySelector(`#tariffs-${id}`).getBoundingClientRect().top +
    window.scrollY -
    document.querySelector('#timeline-container').getBoundingClientRect().height -
    20;

  window.scrollTo(0, yPos);
}

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
    scrollToId(id);
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

// Get list of ids
const idList = Array.from(timelineDots).map(c => c.dataset.cardId);
const leftButton = document.querySelector('.timeline__left-button');
const rightButton = document.querySelector('.timeline__right-button');

function updateButtons(newIndex) {
  if (newIndex === 0) {
    leftButton.disabled = true;
    leftButton.classList.add('disabled');
  } else {
    leftButton.disabled = false;
    leftButton.classList.remove('disabled');
  }

  if (newIndex === idList.length - 1) {
    rightButton.disabled = true;
    rightButton.classList.add('disabled');
  } else {
    rightButton.disabled = false;
    rightButton.classList.remove('disabled');
  }
}

// Add listeners for navigation
leftButton.addEventListener('click', () => {
  const currentCircle = document.querySelector('.timeline__circle.selected');
  const currentId = currentCircle.dataset.cardId;

  const currentIndex = idList.indexOf(currentId);
  const nextDate = idList[currentIndex - 1];

  scrollToId(nextDate);

  updateButtons(currentIndex - 1);
});

rightButton.addEventListener('click', () => {
  const currentCircle = document.querySelector('.timeline__circle.selected');
  const currentId = currentCircle.dataset.cardId;

  const currentIndex = idList.indexOf(currentId);
  const nextDate = idList[currentIndex + 1];

  scrollToId(nextDate);

  updateButtons(currentIndex + 1);
});

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
    offset: ratio,
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

    // Update text
    document.querySelector('.timeline__line-date').innerText = timeString;
    document.querySelector('.timeline__line-value').innerText = `$${value}bn`;

    updateButtons(currentIndex);
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
  ratio =
    document.querySelector('#timeline-container').getBoundingClientRect().height /
    window.innerHeight;

  if (ratio > 0.2) {
    ratio *= 1.15;
  }

  scroller.setup({
    step: '.date-step',
    offset: ratio,
    progress: true,
  });
});
