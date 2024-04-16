import rand from 'random-seed';
import wiki from 'wikipedia';
import { MINIMUM_YEAR } from './constants';

// Matches for any text followed by a space, a dash, a space,
// and then any other text.
const FACT_MATCHER = /.*\b(3[01]|[12][0-9]|[1-9]) \u2013 .*/;

// Fetches a fact from Wikipedia about something that happened within a specific
// [year]. If no facts exist for that year, return undefined. If there is more than
// one fact for this year, the fact is selected based on the current day of the month
// multiplied by the month. For example, if it is February 5th, it will attempt
// to return the 36th fact. If this value is too large compared to the number of
// facts, it will take the modulo of this value with the number of facts.
async function _fetchWikipediaFact(year) {
  const rawContent = await (await wiki.page(`AD_${year}`)).content();
  const lines = rawContent.split('\n');
  const eventLines = lines.slice(
    lines.indexOf(lines.find((line) => line === '== Events ==')) + 1,
    lines.indexOf(lines.find((line) => line === '== Births ==')),
  )
  const factLines = eventLines.filter((line) => FACT_MATCHER.test(line));
  if (factLines.length > 0) {
    // use today's date to determine which fact to display, so everyone has the
    // same puzzle
    const today = new Date();
    const dateNum = today.getDate() * (today.getMonth() + 1);
    const selectedFact = factLines[(dateNum - 1) % factLines.length];
    return {
      year,
      fact: selectedFact.split(' \u2013 ')[1],
    };
  }
  // if there are no facts for the year, return undefined, indicating
  // caller should try again
  return undefined;
}

// Generates [numFacts] facts from Wikipedia from different years.
// The random seed will be based upon today's date, so everyone
// in the world gets the same puzzle daily (starting at midnight their local
// time).
export default async function generateFacts(numFacts, attempt = 0, years = []) {
  const todayDate = new Date().toDateString();
  const factPromises = [];
  let i = 0;
  while (factPromises.length < numFacts) {
    const randomizer = rand.create(`${attempt}-${todayDate}-${i}`);
    i++;
    const year = randomizer.intBetween(MINIMUM_YEAR, new Date().getFullYear());
    if (years.includes(year)) {
      // prevent duplicates
      continue;
    }
    years.push(year);
    factPromises.push(_fetchWikipediaFact(year));
  }
  const facts = (await Promise.all(factPromises)).filter((fact) => fact);
  // in case we didn't get enough facts, try again
  if (facts.length < numFacts) {
    facts.push(
      ...(await generateFacts(numFacts - facts.length, attempt + 1, years)),
    );
  }
  return facts;
}
