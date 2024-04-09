import { useEffect, useState } from 'react'
import './App.css'
import fetchWikipediaFact from './logic/fetch_wikipedia_fact';

function App() {
  const [facts, setFacts] = useState([]);

  useEffect(() => {
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
    <>
      <div>
        {facts.map((fact) => <p>{fact.fact}<br /></p>)}
      </div>
    </>
  )
}

export default App
