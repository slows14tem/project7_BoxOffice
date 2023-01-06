import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MvInfo from './MvInfo'
import qs from 'query-string';

export default function BoxMv() {
  const loc = useLocation().search;
  //전달된 쿼리스트링을 확인
  const mvcd = qs.parse(loc).mvcd;
  //쿼리스트링 내용을 파싱하여 오브젝트 생성

  const [mv, setMv] = useState();

  //useEffect에서는 async, await 바로 못쓴다.
  useEffect(() => {
    getMovie(mvcd);
    //movieCd값을 매개변수로 getMovie를 호출
  }, [])

  const getMovie = async (mvcd) => {
    let url = 'https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?'
    url = url + 'key=' + 'f5eef3421c602c6cb7ea224104795888' //본래는 키값이 들어가야하기 때문에 이 방식이 편하다.
    url = url + '&movieCd=' + mvcd;

    const resp = await fetch(url);
    const data = await resp.json();
    
    setMv(data);
    //setMv를 통해서 랜더링된 후 data 변수에 요청된 영화정보가 mv에 담긴다.
  }

  return (
    <>
      <h1>영화 정보</h1>
      <div>
        {mv && <MvInfo m={mv}/>}
        {/* 영화정보를 MvInfo에 props를 통해서 넘긴다. */}
      </div>
    </>
  );
}