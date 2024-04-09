import { readFileSync, writeFileSync } from 'fs';
import { tabletojson } from 'tabletojson';

const extractHref = (anchorElement: string) => {
  const attributeSplit = anchorElement.split('"');
  const hrefIndex = attributeSplit.findIndex((str) => str.includes('href'));
  return attributeSplit[hrefIndex + 1];
};

const formatArtist = (artist) => {
  const { Artist, Genre, Instagram, Spotify } = artist;
  return {
    name: Artist,
    genre: Genre,
    instagram: extractHref(Instagram),
    spotify: extractHref(Spotify),
  };
};

(async () => {
  const response = await fetch('https://www.pdxpresents.com/portland-artists/');
  const html = await response.text();
  writeFileSync('portland-artists.html', html);

  // uncomment to use cached data instead
  // const html = readFileSync('portland-artists.html').toString();

  const jsonTables = tabletojson.convert(html, { stripHtmlFromCells: false });
  const artists = jsonTables[0].map(formatArtist);

  writeFileSync('portland-artists.json', JSON.stringify(artists, null, 2));
})();
