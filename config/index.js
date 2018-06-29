import * as bertha from 'bertha-client';
import _ from 'underscore';
import * as d3Array from 'd3-array';
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
    ['items', 'content|object', 'timeline'],
    { republish: true },
  );
  const groups = _.uniq(_.pluck(data.items, 'category'));

  const itemsWithoutValues = data.items.filter(a => a.dollareffect === null);
  const itemsWithValues = _.sortBy(
    data.items.filter(a => a.dollareffect !== null),
    item => -item.dollareffect,
  );
  const itemsSortedByDollarEffect = itemsWithValues.concat(itemsWithoutValues);
  const groupedItems = _.groupBy(itemsSortedByDollarEffect, item => item.date);

  const timeline = data.timeline;
  const maxValue = _.pluck(timeline, 'value').reduce((a, b) => Math.max(a, b));

  const categorySummary = timeline.map(date => ({
    ...date,
    categories: _.groupBy(_.sortBy(groupedItems[date.name], a => a.category), 'category'),
  }));

  // Calculate positions in the timeline
  const parseTime = d3TimeFormat.timeParse('%Y-%m-%d');
  const max = d3Array.max(categorySummary, x => parseTime(x.name));
  const min = d3Array.min(categorySummary, x => parseTime(x.name));
  const timeScale = d3Scale
    .scaleTime()
    .domain([min, max])
    .range([0, 100]);
  categorySummary.forEach((x, i) => {
    x.time = timeScale(parseTime(x.name));
  });
  timelineSpacing(categorySummary, 3, 1, [0, 100]);

  // Calculate total trade affected by tariffs
  const totalTradeAffected = categorySummary.reduce((a, b) => (b.display ? a + b.value : a), 0);

  return {
    ...d,
    data,
    groups,
    groupedItems,
    categorySummary,
    totalTradeAffected,
    maxValue,
    timeline,
    flags,
    onwardJourney,
  };
};
