import React from "react";
import fetchWikipediaFact from "../logic/fetch_wikipedia_fact";

// The daily game portion of the website, containing game layout info.
export default function DailyGame() {
  const [facts, setFacts] = React.useState([]);

  React.useEffect(() => {
    async function _fetch() {
      // TODO: algo for coming up with these years
      setFacts(
        await Promise.all([
          fetchWikipediaFact(2021),
          fetchWikipediaFact(2017),
          fetchWikipediaFact(1999),
          fetchWikipediaFact(1736),
          fetchWikipediaFact(1512),
        ]),
      );
    }
    _fetch();
  }, []);

  return (
    <div>
      {facts.map(
        (fact) => <p key={`fact-${fact.year}`}>{fact.fact}<br /></p>,
      )}
    </div>
  )

}
