import './App.css';
import BoxOffice from './BoxOffice/BoxOffice';
import BoxMv from './BoxOffice/BoxMv';
import { Routes, Route } from 'react-router-dom'
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<BoxOffice/>} />
      <Route path='/mv' element={<BoxMv/>} />
    </Routes>
      
    </>
  );
}

export default App;
