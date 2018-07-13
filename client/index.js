import './styles.scss';
import scrollama from 'scrollama';
import * as d3TimeFormat from 'd3-time-format';
import stickyHeader from './components/sticky-header/index.js';

window.addEventListener('load', (event) => {
  stickyHeader.init();
});

// const timelineDots = document.querySelectorAll('.timeline__circle');
//
// // Calculate ratio for scrolling
// let ratio =
//   document.querySelector('#timeline-container').getBoundingClientRect().height /
//   window.innerHeight *
//   1.8;
//
// const parseTime = d3TimeFormat.timeParse('%Y-%m-%d');
// const getMonth = d3TimeFormat.timeFormat('%B');
// const getDay = d3TimeFormat.timeFormat('%e');
//
// function scrollToId(id) {
//   const yPos =
//     document.querySelector(`#tariffs-${id}`).getBoundingClientRect().top +
//     window.scrollY -
//     document.querySelector('#timeline-container').getBoundingClientRect().height -
//     20;
//
//   window.scrollTo(0, yPos);
// }
//
// // Add click events to timeline circles
// Array.from(timelineDots).forEach((timelineDot) => {
//   timelineDot.addEventListener('click', () => {
//     const id = timelineDot.dataset.cardId;
//     scrollToId(id);
//   });
//
//   timelineDot.addEventListener('mouseover', () => {
//     const id = timelineDot.dataset.cardId;
//     const textRight = document.querySelector('.timeline__line-text-right');
//     textRight.style.display = 'inline';
//
//     const time = parseTime(id);
//     const displayString = `${getMonth(time)} ${getDay(time).trim()}`;
//
//     textRight.innerText = displayString;
//   });
//
//   timelineDot.addEventListener('mouseout', () => {
//     const textRight = document.querySelector('.timeline__line-text-right');
//     textRight.style.display = 'none';
//   });
// });
//
// // Get list of ids
// const idList = Array.from(timelineDots).map(c => c.dataset.cardId);
// const leftButton = document.querySelector('.timeline__left-button');
// const rightButton = document.querySelector('.timeline__right-button');
// const topButton = document.querySelector('.timeline__top-button');
//
// function updateButtons(newIndex) {
//   if (newIndex === 0) {
//     leftButton.disabled = true;
//     leftButton.classList.add('disabled');
//   } else {
//     leftButton.disabled = false;
//     leftButton.classList.remove('disabled');
//   }
//
//   if (newIndex === idList.length - 1) {
//     rightButton.disabled = true;
//     rightButton.classList.add('disabled');
//   } else {
//     rightButton.disabled = false;
//     rightButton.classList.remove('disabled');
//   }
// }
//
// function clearCirclesExcept(id) {
//   timelineDots.forEach((circle) => {
//     if (circle.dataset.cardId !== id) {
//       circle.classList.remove('selected');
//     }
//   });
// }
//
// function updateTimelineSelection(id) {
//   const circle = document.querySelector(`.timeline__circle[data-card-id="${id}"`);
//   circle.classList.add('selected');
//   clearCirclesExcept(id);
// }
//
// function updateHeader(country) {
//   const topBanner = document.querySelector('.timeline__country-banner');
//   topBanner.classList.remove('china');
//   topBanner.classList.remove('us');
//
//   if (country === 'china') {
//     topBanner.classList.add('china');
//     topBanner.querySelector('.text').innerText = 'Chinese tariffs on US goods';
//   } else {
//     topBanner.classList.add('us');
//     topBanner.querySelector('.text').innerText = 'US tariffs on Chinese goods';
//   }
// }
//
// // Add listeners for navigation
// leftButton.addEventListener('click', () => {
//   const currentCircle = document.querySelector('.timeline__circle.selected');
//   const currentId = currentCircle.dataset.cardId;
//
//   const currentIndex = idList.indexOf(currentId);
//   const nextDate = idList[currentIndex - 1];
//
//   scrollToId(nextDate);
//
//   updateButtons(currentIndex - 1);
// });
//
// rightButton.addEventListener('click', () => {
//   const currentCircle = document.querySelector('.timeline__circle.selected');
//   const currentId = currentCircle.dataset.cardId;
//
//   const currentIndex = idList.indexOf(currentId);
//   const nextDate = idList[currentIndex + 1];
//
//   scrollToId(nextDate);
//
//   updateButtons(currentIndex + 1);
// });
//
// topButton.addEventListener('click', () => {
//   const firstId = idList[0];
//   updateButtons(0);
//
//   scrollToId(firstId);
//   scrollToId(firstId);
// });
//
// // Add scroll triggers to date sections
// const scroller = scrollama();
//
// scroller
//   .setup({
//     step: '.date-step',
//     offset: ratio,
//     container: '.scroll-container',
//     graphic: '#timeline-container',
//   })
//   .onContainerEnter((trigger) => {
//     document.querySelector('#timeline-container').classList.add('tacked');
//     document.querySelector('#timeline-container').classList.remove('initial');
//     const height =
//       document.querySelector('#timeline-container').getBoundingClientRect().height + 40;
//     document.querySelector('.scroll-container .content').style.paddingTop = `${height}px`;
//     document.querySelector('.bottom-nav').classList.remove('hidden');
//     document.querySelector('.timeline__country-banner').classList.remove('large-text');
//     document.querySelector('.timeline-inner-container').classList.add('o-grid-container');
//     document.querySelector('.timeline-cols').dataset.oGridColspan = '12 S11 Scenter M9 L8 XL7';
//     rightButton.disabled = false;
//     rightButton.classList.remove('disabled');
//   })
//   .onContainerExit((trigger) => {
//     if (trigger.direction === 'up') {
//       document.querySelector('#timeline-container').classList.remove('tacked');
//       document.querySelector('#timeline-container').classList.add('initial');
//       document.querySelector('.scroll-container .content').style.paddingTop = '20px';
//       document.querySelector('.bottom-nav').classList.add('hidden');
//       document.querySelector('.timeline__country-banner').classList.add('large-text');
//       document.querySelector('.timeline-inner-container').classList.remove('o-grid-container');
//       document.querySelector('.timeline-cols').dataset.oGridColspan = '';
//       rightButton.disabled = true;
//       rightButton.classList.add('disabled');
//     }
//   })
//   .onStepEnter((trigger) => {
//     // If page refreshed, add sticky header
//     // document.querySelector('#timeline-container').classList.add('tacked');
//
//     const id = trigger.element.dataset.cardId;
//     const countryName = trigger.element.dataset.countryName;
//
//     // Highlight selected timeline circle
//     updateTimelineSelection(id);
//
//     // Get current date, previous id, and next id
//     const currentIndex = idList.indexOf(id);
//     const prevIndex = currentIndex === 0 ? 0 : currentIndex - 1;
//     const nextIndex = currentIndex < idList.length - 1 ? currentIndex + 1 : currentIndex;
//
//     // Set data
//     const time = parseTime(id);
//     const timeString = `${getMonth(time)} ${getDay(time).trim()}`;
//     const value = trigger.element.dataset.cardValue;
//
//     // Update text
//     document.querySelector('.timeline__line-date').innerText = timeString;
//     document.querySelector('.timeline__line-value').innerText = `$${value}bn`;
//
//     updateButtons(currentIndex);
//     updateHeader(countryName);
//   })
//   .onStepExit((trigger) => {
//     const id = trigger.element.dataset.cardId;
//     const circle = document.querySelector(`.timeline__circle[data-card-id="${id}"`);
//     if (
//       trigger.index !== 0 &&
//       trigger.direction !== 'up' &&
//       (trigger.index !== timelineDots.length - 1 && trigger.direction !== 'down')
//     ) {
//       // Remove selected timeline circled
//       circle.classList.remove('selected');
//     }
//   });
//
// window.addEventListener('resize', () => {
//   ratio =
//     document.querySelector('#timeline-container').getBoundingClientRect().height /
//     window.innerHeight *
//     1.5;
//
//   scroller.setup({
//     step: '.date-step',
//     offset: ratio,
//     container: '.scroll-container',
//     graphic: '#timeline-container',
//   });
// });
//
// updateButtons(0);
//
// // Update header and timeline navigation on load
// const firstId = idList[0];
// const firstCountry = document.querySelector(`#tariffs-${firstId}`).dataset.countryName;
// updateHeader(firstCountry);
//
// const firstTime = parseTime(firstId);
// const firstTimeString = `${getMonth(firstTime)} ${getDay(firstTime).trim()}`;
// const firstValue = document.querySelector(`#tariffs-${firstId}`).dataset.cardValue;
//
// document.querySelector('.timeline__line-date').innerText = firstTimeString;
// document.querySelector('.timeline__line-value').innerText = `$${firstValue}bn`;
