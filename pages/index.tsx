import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <main className="h-screen text-white bg-gradient-to-br from-blue-600 to-purple-700">
      <Head>
        <title>Mira NFT Marketplace</title>
        <link rel="icon" href="/images/nft.png" />
      </Head>

      <h2>Mira NFT Marketplace</h2>
    </main>
  )
}

export default Home;
