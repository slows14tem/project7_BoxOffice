import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MvInfo from './MvInfo'
import qs from 'query-string';

export default function BoxMv() {
  const loc = useLocation().search;
  const mvcd = qs.parse(loc).mvcd;

  const [mv, setMv] = useState();

  const getMovie = async (mvcd) => {
    let url = 'https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?'
    url = url + 'key=' + 'f5eef3421c602c6cb7ea224104795888' //본래는 키값이 들어가야하기 때문에 이 방식이 편하다.
    url = url + '&movieCd=' + mvcd;

    const resp = await fetch(url);
    const data = await resp.json();
    
    setMv(data);
    //setMv를 통해서 랜더링된 후 data 변수에 요청된 영화정보가 담기면 그정보를 MvInfo에 props를 통해서 넘어간다.

  }
  //useEffect에서는 async, await 바로 못쓴다.
  useEffect(() => {
    getMovie(mvcd);
  }, [])

  return (
    <>
      <h1>영화 정보</h1>
      <div>
        {mv && <MvInfo m={mv}/>}
      </div>
    </>
  );
}