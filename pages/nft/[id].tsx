import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typings';
import Link from 'next/link';
import { BigNumber } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
  collection: Collection
}

const NFTDropPage = ({ collection }: Props) => {
  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [priceInEth, setPriceInEth] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true);
  const nftDrop = useNFTDrop(collection.address);

  // Auth hooks
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  console.log(address)

  useEffect(() => {
    if (!nftDrop) return;

    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll();
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue);
    }

    fetchPrice();
  }, [nftDrop]);

  useEffect(() => {
    if (!nftDrop) return;

    const fetchNFTDropData = async () => {
      setLoading(true);

      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();

      setClaimedSupply(claimed.length);
      setTotalSupply(total);

      setLoading(false);
    }
  
  fetchNFTDropData();
  }, [nftDrop]);

  const mintNFT = () => {
    if (!nftDrop || !address) return;

    const quantity = 1; // How many unique NFTs you want to claim

    setLoading(true);
    const notification = toast.loading('Minting NFT...', {
      style: {
        background: 'white',
        color: '#2761ea',
        fontWeight: 'bolder',
        fontSize: '17px',
        padding: '20px',
      }
    });

    nftDrop.claimTo(address, quantity).then(async (tx) => {
      const receipt = tx[0].receipt; // the transaction receipt
      const claimedTokenId = tx[0].id // the id of the NFT claimed
      const claimedNFT = await tx[0].data(); // (optional) get the claimed NFT metadata

      toast('HOORAY... You Successfully Minted!', {
        style: {
          background: '#2761ea',
          color: 'white',
          fontWeight: 'bolder',
          fontSize: '17px',
          padding: '20px',
        }
      });

      console.log(receipt)
      console.log(claimedTokenId)
      console.log(claimedNFT)
    })
    .catch(err => {
      console.log(err)
      toast('Whoops... Something went wrong!', {
        style: {
          background: 'tomatoes',
          color: 'white',
          fontWeight: 'bolder',
          fontSize: '17px',
          padding: '20px',
        }
      });
    })
    .finally(() => {
      setLoading(false);
      toast.dismiss(notification);
    });
  }

  return (
    <section className='flex flex-col h-screen lg:grid lg:grid-cols-10'>
        {/* Left */}
        <div className='lg:col-span-4 bg-gradient-to-br from-blue-600 to-purple-700'>
            <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
                <figure className='p-2 bg-gradient-to-br from-yellow-400 to-purple-600 rounded-xl'>
                  <img src={urlFor(collection.previewImage).url()} alt='' className='object-cover w-44 rounded-xl lg:h-96 lg:w-72' />
                </figure>

                <div className='p-5 space-y-2 text-center'>
                    <h1 className="text-4xl font-bold text-white">{collection.nftCollectionName}</h1>
                    <h2 className="text-xl text-gray-300">{collection.description}</h2>
                </div>
            </div>
        </div>

        {/* Right */}
        <div className='flex flex-col flex-1 h-screen p-12 lg:col-span-6'>

          {/* header */}
          <header className='flex items-center justify-between'>
            <Link href="/">
              <h1 className='text-xl cursor-pointer w-52 sm:w-80 font-extralight'>Mira NFT Marketplace</h1>
            </Link>
            <button onClick={() => (address ? disconnect() : connectWithMetamask())} className='px-4 py-2 text-xs text-white bg-purple-600 rounded-full lg:px-5 lg:py-3 lg:text-base hover:bg-purple-700'>{address ? 'Sign Out' : 'Sign In'}</button>
          </header>
          <hr className='my-3' />
          
          <Toaster position='bottom-right' />

          {address && <p className='text-center text-purple-600'>You're logged in with wallet: <strong>{address.substring(0, 5)}...{address.substring(address.length - 5)}</strong></p>}

          {/* content */}
          <div className='flex flex-col items-center flex-1 mt-10 space-y-6 text-center lg:space-y-0 lg:justify-center'>
            <img className='object-cover w-full h-auto pb-10 rounded-xl' src={urlFor(collection.mainImage).url()} alt='nft mosaic' />
            <h2 className="text-xl font-bold text-gray-700 lg:text-2xl lg:font-extrabold">{collection.title}</h2>
            
            {loading ? (
              <p className="pt-2 font-semibold text-orange-500 text-md animate-pulse">Loading supply count...</p>
            ) : (
              <p className="pt-2 font-semibold text-green-500 text-md">{claimedSupply} / {totalSupply?.toString()} NFT's claimed</p>
            )}

          </div>

          {/* mint button */}
          <button onClick={mintNFT} disabled={loading || claimedSupply === totalSupply?.toNumber() || !address} className="w-full h-16 mt-10 text-white bg-purple-600 rounded-full hover:bg-purple-700 disabled:bg-purple-300">
            {loading ? (
              <>Loading</>
            ) : claimedSupply === totalSupply?.toNumber() ? (
              <>Sold OUT!</>
            ) : !address ? (
              <>Sign in to Mint</>
            ) : (
              <span>Mint NFT ({priceInEth} ETH)</span>
            )}
          </button>
        </div>
    </section>
  )
}

export default NFTDropPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == 'collection' && slug.current == $id][0] {
        _id,
        title,
        address,
        description,
        nftCollectionName,
        mainImage {
        asset
      },
      previewImage {
        asset
      },
      slug {
        current
      },
      creator-> {
        _id,
        name,
        address,
        slug {
        current
      },
    },
  }`

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  });

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection
    }
  }
}