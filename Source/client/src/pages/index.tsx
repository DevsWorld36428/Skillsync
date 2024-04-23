import { useState, useEffect } from "react"
import Header from "@components/layout/header"
import Footer from "@components/layout/footer"

const Home = () => {
  return (
    <>
      <Header page='Home' />
      <div className="flex justify-center mt-40 h-screen">
        <div className="text-[2.5em]">
          Let's play League of Legends with teammates, very fun
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home