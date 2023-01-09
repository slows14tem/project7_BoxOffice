import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MvInfo from './MvInfo'
import qs from 'query-string';

export default function BoxMv() {
  const loc = useLocation().search;
  //전달된 쿼리스트링을 확인
  const mv_cd = qs.parse(loc).mvcd;
  //쿼리스트링 내용을 파싱하여 오브젝트 생성

  const [mv, setMv] = useState();

  //useEffect에서는 async, await 바로 못쓴다.
  useEffect(() => {
    getMovie(mv_cd);
    //movieCd값을 매개변수로 getMovie를 호출
  }, [])

  const getMovie = async (mv_cd) => {
    let url = 'https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?'
    url = url + 'key=' + 'f5eef3421c602c6cb7ea224104795888'
    url = url + '&movieCd=' + mv_cd;
    //영화진흥위원회 오픈API에서 제공하는 url을 수정

    const resp = await fetch(url);
    const data = await resp.json();
    
    setMv(data);
    //랜더링된 후 data 변수에 요청된 영화정보가 mv 변수에 담긴다.
  }

  return (
    <>
      <h1>영화 정보</h1>
      <div>
        {mv && <MvInfo m={mv}/>}
        {/* 영화정보 mv를 MvInfo에 props를 통해서 넘긴다. */}
      </div>
    </>
  );
}