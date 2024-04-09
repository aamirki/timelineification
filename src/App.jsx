import { useEffect, useState } from 'react'
import './App.css'
import fetchWikipediaFact from './logic/fetch_wikipedia_fact';

function App() {
  const [fact, setFact] = useState(null);

  useEffect(() => {
    async function _fetch() {
      setFact(await fetchWikipediaFact(1899));
    }
    _fetch();
  }, []);

  return (
    <>
      <p>
        {fact?.fact ?? 'Hello Word'}
      </p>
    </>
  )
}

export default App
