import React, { useState, useEffect, createContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; //theme
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './App.css'
import Countdown from './countdown';
import Greeting from '../OpeningModal/opening_modal';

export const AppContext = createContext(null);

const App = () => {

  const [count, setCount] = useState('Loading');
  const [count1, setCount1]=useState('Loading');
  const [count2, setCount2]= useState('Loading');
  const [openingModal, setOpeningModal]=useState(true)//opens on page load

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(Countdown("Feb, 16, 2025 04:30", "Our Wedding"));
      setCount1(Countdown("Feb, 07, 2025 23:30", "Till We Are Together"));
      setCount2(Countdown("Feb, 05, 2025 19:00", "Until I Am On The Plane"));
    }, 1000);
  
    return () => clearInterval(interval); // This is the cleanup function
    }, []
  ); // The empty dependency array ensures this runs only once on mount and unmount
  
  const handleCloseModal = () => { // This changes state for modal once item is closed.
    setOpeningModal(false);
  };

  return (
    <div id='homemaindiv'>
      <AppContext.Provider value ={{}}>
        <h1 className='homeh1fancy'>Sukanya & Mark</h1>
        <h2 className="homeh2fancy">The Future Mr. & Mrs. Wade</h2>
        <div className='homeh3div'>
          <h3 className="homenormal">🇹🇭 ⛪︎ 🇺🇲</h3>
          <h3 className="homenormal">Date: 2|16|2025</h3>
          <h3 className="homenormal">Location: Surin Thailand</h3>
          <h3 className="homenormal">{count2}</h3>
          <h3 className="homenormal">{count1}</h3>
          <h3 className="homenormal">{count}</h3>
          <hr className='homeline'></hr>
          <h3 className="homenormal">We're excited to announce that we'll be getting married in Thailand on February 16, 2025! While we understand that traveling to Thailand may not be feasible for everyone, we're planning a second celebration in the USA after Fa receives her visa so that we can share this special occasion with all of our family and friends. We'll share details about the US celebration as soon as we have them.</h3>
          <h3 className="homenormal">พวกเรามีความยินดีที่จะประกาศว่าเราจะแต่งงานกันที่ประเทศไทยในวันที่ 16 กุมภาพันธ์ 2568! เนื่องจากเราเข้าใจดีว่าการเดินทางมาประเทศไทยอาจจะไม่สะดวกสำหรับทุกคน เราจึงวางแผนที่จะจัดงานฉลองครั้งที่สองในสหรัฐอเมริกาหลังจากที่ฟ้าได้รับวีซ่า เพื่อให้เราสามารถแบ่งปันช่วงเวลาพิเศษนี้กับครอบครัวและเพื่อนๆ ทุกคนได้ เราจะแจ้งรายละเอียดเกี่ยวกับการฉลองในสหรัฐอเมริกาให้ทราบทันทีที่เรามีข้อมูล</h3>
        </div>
        <Greeting show={openingModal} onClose={handleCloseModal} />
      </AppContext.Provider>
    </div>
  )
}

export default App; 