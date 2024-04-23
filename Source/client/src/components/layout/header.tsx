import React, { useState, } from 'react'
import Head from "next/head"
import Login from '@components/dialogs/login'
import Register from '@components/dialogs/register'
import Mask from './mask'

interface PageTitleProps {
  page: string
}

const Header: React.FC<PageTitleProps> = ({ page }) => {
  const [toLogin, setToLogin] = useState(false)
  const [toRegister, setToRegister] = useState(false)

  return (
    <>
      {toLogin
        ? <><Mask /><Login toRegister={setToRegister} toLogin={setToLogin}/></>
        : toRegister
          ? <Register toRegister={setToRegister} toLogin={setToLogin}/>
          : <></>
      }
      <Head>
        <title>Skillsync | {page}</title>
      </Head>
      <header className='flex flex-row py-5 px-10 justify-between'>
        <div className='text-[2.2em]'>
          Skillsync
        </div>
        <div className='flex flex-row'>
          <button className='bg-blue-500 mr-1 hover:bg-blue-700 text-white font-bold text-[1rem] py-2 px-5 rounded' onClick={() => setToLogin(true)}>Log in</button>
          <button className='bg-blue-500 ml-1 hover:bg-blue-700 text-white font-bold text-[1rem] py-2 px-4 rounded' onClick={() => setToRegister(true)}>Sign Up</button>
        </div>
      </header>
    </>
  )
}

export default Header
