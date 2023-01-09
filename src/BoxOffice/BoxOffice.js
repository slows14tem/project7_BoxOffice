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
    //영화진흥위원회 오픈API에서 제공하는 url을 수정

    try{
      const resp = await fetch(url);
      //await = url이 정상적으로 실행될떄까지 기다림
      const data = await resp.json();
      let dailyBoxOfficeList = data.boxOfficeResult.dailyBoxOfficeList;
      setOfficeList(
        dailyBoxOfficeList.map((item) => 
        <li key={item.movieCd} className="lis">
          {/* 해당 정보를 출력하는 페이지로 이동 */}
          <Link to={'/mv?mvcd=' + item.movieCd}> {/* url에 해당 영화의 코드 번호를 입력 */}
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
  //어제 날짜를 생성해서 viewDay 변수에 입력
  useEffect(() => {
    console.log(1)
    const yesterday = new Date();
    yesterday.setDate(new Date().getDate()-1);
    let d = yesterday.toISOString().substring(0, 10).replaceAll('-','');
    //날짜가 URL에 입력될 형식으로변경 (1999-12-31 -> 19991231)
    setviewDay(d) 
    //페이지가 처음 랜더링 되었을 때 viewDay값이 없다가 setviewDay 써서 재랜더링하여 viewDay변수에 값 입력
  },[]);

  //이벤트 함수
  const handleChange = (e) => {
    e.preventDefault();
    setviewDay(refDateIn.current.value.replaceAll('-',''));
    //달력으로 입력받은 날짜값(refDateIn)를 url에 입력될 viewDay로 변경
  }

  useEffect(()=>{
    (viewDay && setviewDayF(viewDay.substring(0,4)+'.'+viewDay.substring(4,6)+'.'+viewDay.substring(6,8)));
    //현재 viewDay에 값이 있으면 setviewDayF가 실행
    getBoxOffice(viewDay);
    //viewDay를 매개변수로 getBoxOffice함수 호출
    //viewDayF : <h1>테그에 입력할 날짜 (형식 : 1999.12.31)
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

//UseRef 참고
//https://www.daleseo.com/react-refs/