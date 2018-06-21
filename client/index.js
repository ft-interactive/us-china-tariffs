import './styles.scss';

const timelineDots = document.querySelectorAll('.timeline__circle');

window.addEventListener('scroll', () => {
  const containerHeight =
    document.querySelector('#timeline-wrapper').getBoundingClientRect().bottom -
    document.querySelector('#timeline-wrapper').getBoundingClientRect().top +
    80;

  const containerPosition = document.querySelector('#timeline-wrapper').offsetTop + containerHeight;

  if (window.scrollY - window.innerHeight > containerPosition) {
    document.querySelector('#timeline-container').classList.add('tacked');
  } else {
    document.querySelector('#timeline-container').classList.remove('tacked');
  }
});

Array.from(timelineDots).forEach((timelineDot) => {
  timelineDot.addEventListener('click', () => {
    const id = timelineDot.dataset.cardId;
    const yPos =
      document.querySelector(`#tariffs-${id}`).getBoundingClientRect().top +
      window.scrollY -
      84 -
      20;

    console.log(yPos);
    window.scrollTo(0, yPos);

    const textDate = timelineDot.querySelector('.timeline__circle__text-date').innerText;
  });
});
