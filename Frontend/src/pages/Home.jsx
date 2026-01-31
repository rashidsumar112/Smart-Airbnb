import React, { useContext } from 'react'
import Navbar from '../Components/Navbar'
import { listDataContext } from '../Context/ListContext'
import Card from '../Components/Card'

function Home() {
  let {getlist,setGetList}=useContext(listDataContext)
  return (
    <div className='overflow-hidden'>

     <Navbar />
     <div className='w-[100vw]  flex items-center justify-center gap-[25px] flex-wrap mt-[250px] md:mt-[180px]'>

      {getlist.map((list)=>(
        <Card title={list.title} landmark={list.landmark} city={list.city} image1={list.image1} image2={list.image2} image3={list.image3} rent={list.rent} id={list._id}/>
      )

      )}
     </div>

    </div>
  )
}

export default Home