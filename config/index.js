import * as bertha from 'bertha-client';
import _ from 'underscore';

import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';

export default async (environment = 'development') => {
  const d = await article(environment);
  const flags = await getFlags(environment);
  const onwardJourney = await getOnwardJourney(environment);
  /*
  An experimental demo that gets content from the API
  and overwrites some model values. This requires the Link File
  to have been published. Also next-es-interface.ft.com probably
  isn't a reliable source. Also this has no way to prevent development
  values being seen in productions... use with care.

  try {
    const a = (await axios(`https://next-es-interface.ft.com/content/${d.id}`)).data;
    d.headline = a.title;
    d.byline = a.byline;
    d.summary = a.summaries[0];
    d.title = d.title || a.title;
    d.description = d.description || a.summaries[1] || a.summaries[0];
    d.publishedDate = new Date(a.publishedDate);
    f.comments = a.comments;
  } catch (e) {
    console.log('Error getting content from content API');
  }

  */

  const data = await bertha.get('1VCgf3zQ8w1j0uFJDaPEnc3xRlZ9XCXD8JQlg4jF0gPo', ['items', 'content|object', 'totalvalues|object'], { republish: true });
  const groups = _.sortBy(_.uniq(_.pluck(data.items, 'category')));
  const groupedItems = _.groupBy(_.sortBy(data.items, item => -item.dollareffect), item => item.date);

  const categorySummary = _.map(groupedItems, (dateGroup) => {
    return {
      dateGroup: dateGroup[0].date,
      country: dateGroup[0].country,
      categories: _.groupBy(_.sortBy(dateGroup, a => a.category), 'category'),
    };
  });
  const totalValues = data.totalvalues;
  const maxValue = _.values(data.totalvalues).reduce((a, b) => Math.max(a, b));

  return {
    ...d,
    data,
    groups,
    groupedItems,
    categorySummary,
    maxValue,
    totalValues,
    flags,
    onwardJourney,
  };
};
