import waypoints from 'waypoints/lib/noframework.waypoints.min';

function init() {
  const sections = Array.from(document.querySelectorAll('.date-step'));

  sections.forEach((section) => {
    const switchEl = section.querySelector('.item-list-switch button');
    const listEl = section.querySelector('.item-list');
    if (switchEl) {
      switchEl.addEventListener('click', () => {
        listEl.classList.remove('closed');
        Waypoint.refreshAll();
        switchEl.style.display = 'none';
      });
    }
  });
}

export default { init };
