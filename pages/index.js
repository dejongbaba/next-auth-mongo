import React from 'react'
import Head from 'next/head'
import withAuth from '../components/withAuth'

function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <h1 className="title">Home</h1>
      <p>Welcome!</p>
    </>
  )
}

export default withAuth(Home)
