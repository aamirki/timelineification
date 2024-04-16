import React from "react";
import generateFacts from "../logic/generate_facts";
import { NUM_FACTS } from "../logic/constants";

// The daily game portion of the website, containing game layout info.
export default function DailyGame() {
  const [facts, setFacts] = React.useState([]);

  React.useEffect(() => {
    async function _fetch() {
      setFacts(await generateFacts(NUM_FACTS));
    }
    _fetch();
  }, []);

  if (facts.length === 0) {
    return <div>Loading…</div>;
  }

  return (
    <div>
      <p>Minimum Year: {Math.min(...facts.map((fact) => fact.year))}</p>
      {facts.map(
        (fact) => <p key={`fact-${fact.year}`}>{fact.fact}<br /></p>,
      )}
      <p>Maximum Year: {Math.max(...facts.map((fact) => fact.year))}</p>
    </div>
  )

}
