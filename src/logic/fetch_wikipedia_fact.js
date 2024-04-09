import wiki from "wikipedia";

// Matches for any text followed by a space, a dash, a space,
// and then any other text.
const FACT_MATCHER = /.*\b(3[01]|[12][0-9]|[1-9]) \u2013 .*/;

// Fetches a fact from Wikipedia about something that happened within a specific
// [year]. If so such fact exists, return undefined. If there is more than
// one fact for this year, the fact is selected based on the current day of the month
// multiplied by the month. For example, if it is February 5th, it will attempt
// to return the 36th fact. If this value is too large compared to the number of
// facts, it will take the modulo of this value with the number of facts.
export default async function fetchWikipediaFact(year) {
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
