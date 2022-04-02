import React from 'react';
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

const NFTDropPage = () => {
  // Auth hooks
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  console.log(address)

  return (
    <section className='flex flex-col h-screen lg:grid lg:grid-cols-10'>
        {/* Left */}
        <div className='lg:col-span-4 bg-gradient-to-br from-blue-600 to-purple-700'>
            <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
                <figure className='p-2 bg-gradient-to-br from-yellow-400 to-purple-600 rounded-xl'>
                  <img src='/images/1.png' alt='' className='object-cover w-44 rounded-xl lg:h-96 lg:w-72' />
                </figure>

                <div className='p-5 space-y-2 text-center'>
                    <h1 className="text-4xl font-bold text-white">MiraNFT Cruise</h1>
                    <h2 className="text-xl text-gray-300">A collection of Mira Cruise for travel in the metaverse</h2>
                </div>
            </div>
        </div>

        {/* Right */}
        <div className='flex flex-col flex-1 h-screen p-12 lg:col-span-6'>
          {/* header */}
          <header className='flex items-center justify-between'>
            <h1 className='text-xl cursor-pointer w-52 sm:w-80 font-extralight'>Mira NFT Marketplace</h1>
            <button onClick={() => (address ? disconnect() : connectWithMetamask())} className='px-4 py-2 text-xs text-white bg-purple-600 rounded-full lg:px-5 lg:py-3 lg:text-base hover:bg-purple-700'>{address ? 'Sign Out' : 'Sign In'}</button>
          </header>
          <hr className='my-3' />

          {address && <p className='text-center text-purple-600'>You're logged in with wallet: <strong>{address.substring(0, 5)}...{address.substring(address.length - 5)}</strong></p>}

          {/* content */}
          <div className='flex flex-col items-center flex-1 mt-10 space-y-6 text-center lg:space-y-0 lg:justify-center'>
            <img className='object-cover pb-10 w-96 lg:h-72' src='/images/pixmike.jpg' alt='nft mosaic' />
            <h2 className="text-2xl font-bold lg:text-5xl lg:font-extrabold">Some title for this copy | MiraNFT</h2>
            <p className="pt-2 text-xl text-green-500">13 / 21 NFT's claimed</p>
          </div>

          {/* mint button */}
          <button className="w-full h-16 mt-10 text-white bg-purple-600 rounded-full hover:bg-purple-700">Mint NFT (0.01 ETH)</button>
        </div>
    </section>
  )
}

export default NFTDropPage