import * as bertha from 'bertha-client';
import * as d3TimeFormat from 'd3-time-format';
import * as d3Scale from 'd3-scale';

import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';
import timelineSpacing from './timeline-spacing';

export default async (environment = 'development') => {
  const d = await article(environment);
  const flags = await getFlags(environment);
  const onwardJourney = await getOnwardJourney(environment);

  const data = await bertha.get(
    '1VCgf3zQ8w1j0uFJDaPEnc3xRlZ9XCXD8JQlg4jF0gPo',
    ['timeline', 'goods', 'content|object'],
    { republish: true },
  );

  const categories = Array.from(new Set(data.goods.map(good => good.category)));

  const timeline = data.timeline.filter(event => event.display).sort((a, b) => a.name < b.name);

  const timelineGoods = timeline.reduce((a, event) => {
    const eventGoods = data.goods.filter(good => good.date === event.name && good.country === event.country);
    if (eventGoods.length === 0) return a;
    const tranchNumbers = Array.from(new Set(eventGoods.map(good => good.tranche)));
    const tranches = tranchNumbers.map((tranche) => {
      const trancheGoods = eventGoods.filter(good => good.tranche === tranche).sort((a, b) => {
        return a.value < b.value;
      });
      return {
        tranche,
        type: trancheGoods[0].type, // assume they're all the same in this tranche
        goods: trancheGoods,
      };
    })
    const item = {
      date: event.name,
      country: event.country,
      tranches,
    };
    return a.concat(item)
  }, []);

  // Calculate positions in the timeline
  const parseTime = d3TimeFormat.timeParse('%Y-%m-%d');
  const timeMin = parseTime(timeline[timeline.length - 1].name);
  const timeMax = parseTime(timeline[0].name);
  const timeScale = d3Scale
    .scaleTime()
    .domain([timeMin, timeMax])
    .range([0, 100]);
  const timelineDates = timeline.map((event) => {
    return {
      name: event.name,
      time: timeScale(parseTime(event.name)),
    };
  });
  timelineSpacing(timelineDates, 3, 1, [0, 100]);

  return {
    ...d,
    categories,
    timeline,
    timelineGoods,
    flags,
    onwardJourney,
  };
};
