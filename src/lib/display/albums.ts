/** Maps album / release names to their cover artwork path and release year */
const albums = {
    'Lunar Strain / Subterranean': { cover: '/images/albums/lunar-strain.jpg', year: '1994' },
    'The Jester Race / Black-Ash Inheritance': { cover: '/images/albums/the-jester-race.jpg', year: '1996' },
    Whoracle: { cover: '/images/albums/whoracle.jpg', year: '1997' },
    Colony: { cover: '/images/albums/colony.jpg', year: '1999' },
    Clayman: { cover: '/images/albums/clayman.jpg', year: '2000' },
    'The Tokyo Showdown': { cover: '/images/albums/the-tokyo-showdown.jpg', year: '2001' },
    'Reroute to Remain': { cover: '/images/albums/reroute-to-remain.jpg', year: '2002' },
    'Soundtrack to Your Escape / Trigger': { cover: '/images/albums/soundtrack-to-your-escape.jpg', year: '2004' },
    'Used and Abused': { cover: '/images/albums/used-and-abused.jpg', year: '2005' },
    'Come Clarity': { cover: '/images/albums/come-clarity.jpg', year: '2006' },
    'A Sense of Purpose': { cover: '/images/albums/a-sense-of-purpose.jpg', year: '2008' },
    'Sounds of a Playground Fading': { cover: '/images/albums/sounds-of-a-playground-fading.jpg', year: '2011' },
    'Siren Charms': { cover: '/images/albums/siren-charms.jpg', year: '2014' },
    'Sounds from the Heart of Gothenburg': { cover: '/images/albums/sounds-from-the-heart-of-gothenburg.jpg', year: '2016' },
    Battles: { cover: '/images/albums/battles.jpg', year: '2016' },
    'Down, Wicked & No Good': { cover: '/images/albums/down-wicked-no-good.jpg', year: '2017' },
    'I, the Mask': { cover: '/images/albums/i-the-mask.jpg', year: '2019' },
    'Clayman 2020': { cover: '/images/albums/clayman-2020.jpg', year: '2020' },
    Foregone: { cover: '/images/albums/foregone.jpg', year: '2023' },
} as Record<
    string,
    | {
          /** Cover artwork path. */
          cover: string
          /** Release year. */
          year: string
      }
    | undefined
>

export default albums
