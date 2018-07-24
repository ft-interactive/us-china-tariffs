import waypoints from 'waypoints/lib/noframework.waypoints.min';
import * as d3TimeFormat from 'd3-time-format';

// // Get list of ids
const timelineDots = document.querySelectorAll('.timeline__circle');
const idList = Array.from(timelineDots).map(c => c.dataset.cardId);
const leftButton = document.querySelector('.timeline__left-button');
const rightButton = document.querySelector('.timeline__right-button');
const topButton = document.querySelector('.timeline__top-button');

const parseTime = d3TimeFormat.timeParse('%Y-%m-%d');
const getMonth = d3TimeFormat.timeFormat('%B');
const getDay = d3TimeFormat.timeFormat('%e');

function scrollToIdAndOpen(id, behavior = 'instant') {
  const section = document.querySelector(id);

  const yPos =
    section.getBoundingClientRect().top +
    window.scrollY -
    document.querySelector('#timeline-container').getBoundingClientRect().height -
    40;

  window.scrollTo({ top: yPos, behavior });

  const switchEl = section.querySelector('.item-list-switch button');
  const listEl = section.querySelector('.item-list');

  if (switchEl) {
    listEl.classList.remove('closed');
    switchEl.style.display = 'none';
  }
}

function scrollToId(id) {
  const yPos =
    document.querySelector(`#tariffs-${id}`).getBoundingClientRect().top +
    window.scrollY -
    document.querySelector('#timeline-container').getBoundingClientRect().height -
    20;

  window.scrollTo(0, yPos);
}

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

function clearCirclesExcept(id) {
  timelineDots.forEach((circle) => {
    if (circle.dataset.cardId !== id) {
      circle.classList.remove('selected');
    }
  });
}

function updateTimelineSelection(id) {
  const circle = document.querySelector(`.timeline__circle[data-card-id="${id}"`);
  circle.classList.add('selected');
  clearCirclesExcept(id);
}

function updateHeader(country) {
  const topBanner = document.querySelector('.timeline__country-banner');
  topBanner.classList.remove('china');
  topBanner.classList.remove('us');

  if (country === 'china') {
    topBanner.classList.add('china');
    topBanner.querySelector('.text').innerText = 'Chinese tariffs on US goods';
  } else {
    topBanner.classList.add('us');
    topBanner.querySelector('.text').innerText = 'US tariffs on Chinese goods';
  }
}

function init() {
  if (window.location.hash) {
    scrollToIdAndOpen(window.location.hash);
  }

  // // Add click events to timeline circles
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

  topButton.addEventListener('click', () => {
    const firstId = idList[0];
    updateButtons(0);

    scrollToId(firstId);
    scrollToId(firstId);
  });

  function addStickyNav() {
    document.querySelector('#timeline-container').classList.add('tacked');
    document.querySelector('#timeline-container').classList.remove('initial');
    const height = document.querySelector('#timeline-container').getBoundingClientRect().height;
    document.querySelector('.scroll-container .content').style.paddingTop = `${height}px`;
    document.querySelector('.bottom-nav').classList.remove('hidden');
    document.querySelector('.timeline__country-banner').classList.remove('large-text');
    document.querySelector('.timeline-inner-container').classList.add('o-grid-container');
    document.querySelector('.timeline-cols').dataset.oGridColspan = '12 S11 Scenter M9 L8 XL7';
    rightButton.disabled = false;
    rightButton.classList.remove('disabled');
  }

  function removeStickyNav() {
    document.querySelector('#timeline-container').classList.remove('tacked');
    document.querySelector('#timeline-container').classList.add('initial');
    document.querySelector('.scroll-container .content').style.paddingTop = '20px';
    document.querySelector('.bottom-nav').classList.add('hidden');
    document.querySelector('.timeline__country-banner').classList.add('large-text');
    document.querySelector('.timeline-inner-container').classList.remove('o-grid-container');
    document.querySelector('.timeline-cols').dataset.oGridColspan = '';
    rightButton.disabled = true;
    rightButton.classList.add('disabled');
  }

  // Add waypoint for header
  const headerWaypoint = new Waypoint({
    element: document.querySelector('.scroll-container'),
    handler(direction) {
      if (direction === 'down') {
        addStickyNav();
      } else {
        removeStickyNav();
      }
    },
  });

  const headerWaypointBottom = new Waypoint({
    element: document.querySelector('#sources'),
    handler(direction) {
      if (direction === 'down') {
        document.querySelector('#timeline-container').style.display = 'none';
      } else {
        document.querySelector('#timeline-container').style.display = 'block';
      }
    },
  });

  // Add waypoint for sections
  const dateSteps = Array.from(document.querySelectorAll('.date-step'));
  const offset = document.querySelector('#timeline-container').getBoundingClientRect().height;

  // Create waypoints for each content section
  const waypoints = dateSteps.map((el, index) => {
    const enterWaypoint = new Waypoint({
      element: el,
      handler(direction) {
        const id = el.dataset.cardId;

        // Get current date, previous id, and next id
        const currentIndex = idList.indexOf(id);
        const prevIndex = currentIndex === 0 ? 0 : currentIndex - 1;
        const nextIndex = currentIndex < idList.length - 1 ? currentIndex + 1 : currentIndex;
        let newIndex;

        if (direction === 'down') {
          newIndex = currentIndex;
        } else {
          newIndex = prevIndex;
        }

        const newEl = dateSteps[newIndex];

        const countryName = newEl.dataset.countryName;
        const newId = newEl.dataset.cardId;

        // Highlight selected timeline circle
        updateTimelineSelection(newId);

        // Set data
        const time = parseTime(newId);
        const timeString = `${getMonth(time)} ${getDay(time).trim()}`;
        const value = newEl.dataset.cardValue;

        // Update text
        document.querySelector('.timeline__line-date').innerText = timeString;
        document.querySelector('.timeline__line-value').innerText = `$${value}bn`;

        updateButtons(newIndex);
        updateHeader(countryName);
      },
      offset: `${offset + 60}px`,
    });
  });

  // Update header and timeline navigation on load
  const firstId = idList[0];
  const firstCountry = document.querySelector(`#tariffs-${firstId}`).dataset.countryName;
  updateHeader(firstCountry);

  const firstTime = parseTime(firstId);
  const firstTimeString = `${getMonth(firstTime)} ${getDay(firstTime).trim()}`;
  const firstValue = document.querySelector(`#tariffs-${firstId}`).dataset.cardValue;

  document.querySelector('.timeline__line-date').innerText = firstTimeString;
  document.querySelector('.timeline__line-value').innerText = `$${firstValue}bn`;

  updateButtons(0);
}

export default { init };
