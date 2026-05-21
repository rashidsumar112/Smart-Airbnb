import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import { listDataContext } from '../Context/ListContext'
import Card from '../Components/Card'

function Home() {

  let { getlist, newgetlist, setnewGetList } = useContext(listDataContext)

  useEffect(() => {
    if (getlist?.length > 0) {
      setnewGetList(getlist)
    }
  }, [getlist, setnewGetList])

  return (
    <div className='overflow-hidden text-slate-900'>

      <Navbar />

      <main className='mx-auto w-full max-w-7xl px-4 pt-[155px] pb-12 md:pt-[170px]'>
        <section
          className='hero-pulse relative overflow-hidden rounded-[28px] border border-slate-700/50 px-5 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl md:px-8 md:py-8'
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(3, 7, 18, 0.90), rgba(30, 41, 59, 0.74), rgba(15, 23, 42, 0.82)), url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.03),transparent_28%)]' />

          <div className='relative flex min-h-[320px] items-center justify-center'>
            <div className='mx-auto max-w-3xl text-center text-white'>
              <span className='hero-fade inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium tracking-[0.18em] text-white/80 backdrop-blur-md md:text-sm'>
                ✨ Property booking • renting • stylish living
              </span>

              <h1 className='hero-float mt-5 text-3xl font-black leading-tight tracking-tight md:text-5xl text-sky-100'>
                Find your next beautiful stay.
              </h1>

              <p className='hero-fade mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-200/85 md:text-base'>
                Browse elegant homes, book with confidence, and list property to reach more guests.
              </p>

              <div className='hero-fade mt-5 flex flex-wrap justify-center gap-3'>
                <Link
                  to='/listpage1'
                  className='rounded-full bg-slate-200/90 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-sky-200'
                >
                  List your home
                </Link>
                <a
                  href='#featured-listings'
                  className='rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/10'
                >
                  Explore listings
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id='featured-listings' className='mt-12 space-y-5'>
          <div className='text-center'>
            <p className='text-sm font-semibold uppercase tracking-[0.28em] text-green-600'>Featured stays</p>
            <h2 className='mt-2 text-xl font-semibold text-slate-900 md:text-2xl'>Hand-picked homes for you</h2>
          </div>

          <div className='grid place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {newgetlist.map((list) => (
              <Card
                key={list._id}
                title={list.title}
                landmark={list.landmark}
                city={list.city}
                image1={list.image1}
                image2={list.image2}
                image3={list.image3}
                rent={list.rent}
                id={list._id}
                ratings={list.ratings}
                isBooked={list.isBooked}
                host={list.host}
              />
            ))}
          </div>
        </section>
      </main>

    </div>
  )
}

export default Home