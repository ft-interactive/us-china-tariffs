export default (environment = 'development') => ({ // eslint-disable-line

  // link file UUID
  id: '',

  // canonical URL of the published page
  //  get filled in by the ./configure script
  url: '',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date(),

  headline: 'The looming US-China trade war',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'Explore a comprehensive list of the more than 1,500 items threatened by new tariffs',

  topic: {
    name: 'Trade disputes',
    url: 'https://www.ft.com/stream/49181791-a1a9-4966-ac30-010846ec76d8',
  },

  // relatedArticle: {
  //   text: 'Related article »',
  //   url: 'https://en.wikipedia.org/wiki/Politics_and_the_English_Language',
  // },

  mainImage: {
    title: '',
    description: '',
    credit: '',

    // You can provide a UUID to an image and it was populate everything else
    uuid: '87851dec-3835-11e8-8eee-e06bde01c544',

    // You can also provide a URL
    // url: 'https://image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fc4bf0be4-7c15-11e4-a7b8-00144feabdc0?source=ig&fit=scale-down&width=700',
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Joanna S Kao', url: 'https://www.ft.com/joanna-s-kao' },
    { name: 'Ed Crooks', url: 'https://www.ft.com/stream/42dab372-28d1-364c-b4f2-fc7c4a07e906' },
    { name: 'Jane Pong', url: 'https://www.ft.com/jane-pong' },
  ],

  // Appears in the HTML <title>
  title: '',

  // meta data
  description: 'Explore a comprehensive list of the more than 1,500 items threatened by new tariffs',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  // socialImage: '',
  // socialHeadline: '',
  // socialDescription: '',
  // twitterCreator: '@author's_account', // shows up in summary_large_image cards

  // TWEET BUTTON CUSTOM TEXT
  // tweetText: '',
  //
  // Twitter lists these as suggested accounts to follow after a user tweets (do not include @)
  // twitterRelatedAccounts: ['authors_account_here', 'ftdata'],

  // Fill out the Facebook/Twitter metadata sections below if you want to
  // override the General social options above

  // TWITTER METADATA (for Twitter cards)
  // twitterImage: '',
  // twitterHeadline: '',
  // twitterDescription: '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',
  // facebookDescription: '',

  // ADVERTISING
  ads: {
    // Ad unit hierarchy makes ads more granular.
    gptSite: 'ft.com',
    // Start with ft.com and /companies /markets /world as appropriate to your story
    gptZone: false,
    // granular targeting is optional and will be specified by the ads team
    dfpTargeting: false,
  },

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
