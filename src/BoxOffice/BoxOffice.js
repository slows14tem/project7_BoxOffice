import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import './BoxOffice.css'
export default function BoxOffice(){

  // 비동기 통신 then. catch. 구문으로 사용
  // const getBoxOffice = () => {
  //   let url = 'https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?'
  //   url = url + 'key=' + 'f5eef3421c602c6cb7ea224104795888';
  //   url = url + '&targetDt=' + '20120101';

  //   //비동기 통신-처음 랜더링 될때 실행하면 좋음
  //   fetch(url)
  //     .then((resp) => resp.json()) // == {return resp.json}
  //     .then((data) => {console.log(data)})
  //     .catch((err) => {console.log(err)})
  // }

  //state변수
  const [viewDay, setviewDay]= useState();
  const [viewDayF, setviewDayF] = useState();
  const [officeList, setOfficeList] = useState([]);

  //useRef변수 선언
  const refDateIn= useRef();

  //비동기통신 async, await 구문으로 사용
  const getBoxOffice = async(d) => {
    let url = 'https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?'
    url = url + 'key=' + 'f5eef3421c602c6cb7ea224104795888';
    url = url + '&targetDt=' + d;

    try{
      const resp = await fetch(url);  //await = url이 정상적으로 실행될떄까지 기다림
      const data = await resp.json();
      let dailyBoxOfficeList = data.boxOfficeResult.dailyBoxOfficeList;
      setOfficeList(
        dailyBoxOfficeList.map((item) => 
        <li key={item.movieCd} className="lis">
          {/* 해당 영화 정보를 출력하는 페이지로 이동 */}
          <Link to={'/mv?mvcd=' + item.movieCd}>
          <span className="rank">{item.rank}</span>
          <span className="title">{item.movieNm}</span>
          <span className="rankc">{item.rankInten > 0 ? '▲' : item.rankInten < 0 ? '▼' : ''}</span>
          <span className="rankcN">{Math.abs(parseInt(item.rankInten))}</span> {/* 숫자 절대값 만드는 코드 */}            
          </Link>
        </li>)
      )
    }
    catch(err){
      console.log(err);
    }
  }

  //페이지가 처음 랜더링 되었을 때 실행되는 hook
  //어제 날짜를 호출해서 url에 입력될 형식으로 변경한 후 
  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(new Date().getDate()-1);
    let d = yesterday.toISOString().substring(0, 10).replaceAll('-','');
    //state변수 변경
    setviewDay(d) //변경된 d값이 입력되면 재 랜더링... 최초에 mv값이 없다가 setter를 써서 재랜더링
    //떄문에 최초 랜더링에서는 mv값이 없었고 setter를 통해서 재랜더링 된 후 어제 날짜가 출력되는 것
    //처음 렌더링 될때 viewDayF(h1테그 날짜)가 d의 날짜로 출력될 수 있도록 viewDay를 입력해 주는것

    //boxoffice open api call
    getBoxOffice(d);
  },[]);

  //이벤트 함수
  const handleChange = (e) => {
    e.preventDefault();
    console.log("refDateIn", refDateIn.current.value)
    setviewDay(refDateIn.current.value.replaceAll('-',''));
    //달력으로 입력받은 날짜값(refDateIn)를 url에 입력될 viewDay로 변경 (1999-12-31 -> 19991231)
  }

  useEffect(()=>{    
    (viewDay && setviewDayF(viewDay.substring(0,4)+'.'+viewDay.substring(4,6)+'.'+viewDay.substring(6,8)));
    getBoxOffice(viewDay);
    //변경된 viewDay를 매개변수로 getBoxOffice함수 호출
    //viewDayF : <h1>테그에 입력할 날짜 (1999.12.31)
  },[viewDay])

  return(
    <>
      <h1>BoxOffice({viewDayF}일자)</h1>
      <form>
        <input type='date' name='dateIn' ref={refDateIn} onChange={handleChange}/>
      </form>       
        {officeList}
    </>
  )
}

//https://www.daleseo.com/react-refs/