import './styles.scss';
import * as d3TimeFormat from 'd3-time-format';
import stickyHeader from './components/sticky-header/index.js';
import list from './components/list/list.js';

window.addEventListener('load', (event) => {
  stickyHeader.init();
  list.init();
});
