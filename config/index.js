import * as bertha from 'bertha-client';
import _ from 'underscore';

import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';

export default async (environment = 'development') => {
  const d = await article(environment);
  const flags = await getFlags(environment);
  const onwardJourney = await getOnwardJourney(environment);

  const data = await bertha.get('1VCgf3zQ8w1j0uFJDaPEnc3xRlZ9XCXD8JQlg4jF0gPo', ['items', 'content|object', 'timeline'], { republish: true });
  const groups = _.sortBy(_.uniq(_.pluck(data.items, 'category')));

  const itemsWithoutValues = data.items.filter(a => a.dollareffect === null);
  const itemsWithValues = _.sortBy(data.items.filter(a => a.dollareffect !== null), item => -item.dollareffect);
  const itemsSortedByDollarEffect = itemsWithValues.concat(itemsWithoutValues);
  const groupedItems = _.groupBy(itemsSortedByDollarEffect, item => item.date);

  const timeline = data.timeline;
  const maxValue = _.pluck(timeline, 'value').reduce((a, b) => Math.max(a, b));

  const categorySummary = _.map(groupedItems, (dateGroup) => {
    return {
      dateGroup: dateGroup[0].date,
      country: dateGroup[0].country,
      categories: _.groupBy(_.sortBy(dateGroup, a => a.category), 'category'),
      totalValue: timeline.filter(a => a.name === dateGroup[0].date)[0].value,
    };
  });

  return {
    ...d,
    data,
    groups,
    groupedItems,
    categorySummary,
    maxValue,
    timeline,
    flags,
    onwardJourney,
  };
};
