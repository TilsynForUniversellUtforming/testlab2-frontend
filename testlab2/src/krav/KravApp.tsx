import {useEffect, useState} from "react";

type KravType = {
  id: number,
  tittel: string,
  status: string,
  innhald: string,
  gjeldautomat: boolean,
  gjeldnettsider: boolean,
  gjeldapp: boolean,
  urlrettleiing: string
}[];
const KravApp = () => {

  const [krav, setKrav] = useState<KravType>([]);

  useEffect(() => {
    const dataFetch = async () => {
      const data = await (
        await fetch(
          'http://localhost:5173/api/krav/all', {
            headers: {
              'Content-Type': 'application/json'
            },
          }
        )
      ).json();

      setKrav(data);
    };

    dataFetch();
  }, []);

  return (
    <ul>
      {krav.map((krav) => {
        return (
          <li key={krav.id}>
            <span>{krav.tittel}</span>
            <span>{krav.status}</span>
            <span>{krav.innhald}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default KravApp;