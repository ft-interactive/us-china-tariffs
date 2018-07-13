import './styles.scss';
import scrollama from 'scrollama';
import * as d3TimeFormat from 'd3-time-format';
import stickyHeader from './components/sticky-header/index.js';

window.addEventListener('load', (event) => {
  stickyHeader.init();
});
