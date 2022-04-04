import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import { sanityClient, urlFor } from '../sanity';
import { Collection } from '../typings';

interface Props {
  collections: Collection[];
}

const Home = ({ collections }: Props) => {
  

  return (
    <main className="min-h-screen px-10 py-20 text-white mi bg-gradient-to-br from-blue-600 to-purple-700">
      <Head>
        <title>Mira NFT Marketplace</title>
        <link rel="icon" href="/images/nft.png" />
      </Head>

      <header className='flex items-center justify-between'>
        <h1 className='text-xl cursor-pointer w-52 sm:w-80 font-extralight'>Mira NFT Marketplace</h1>
        {/* <button onClick={() => (address ? disconnect() : connectWithMetamask())} className='px-4 py-2 text-xs text-white bg-purple-600 rounded-full lg:px-5 lg:py-3 lg:text-base hover:bg-purple-700'>{address ? 'Sign Out' : 'Sign In'}</button> */}
      </header>
      <hr className='my-3' />

      <section className='p-10 mx-auto shadow-rose-400 max-w-7xl'>
        <div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
          {collections.map(collection => (
            <Link href={`/nft/${collection.slug.current}`}>
              <div key={collection._id} className="flex flex-col items-center transition-all duration-200 cursor-pointer hover:scale-105">
                <img className='object-cover h-96 rounded-2xl' src={urlFor(collection.mainImage).url()} alt={collection.title} />

                <article className='p-5'>
                  <h2 className="text-xl">{collection.title}</h2>
                  <p className="mt-2 text-sm text-gray-100">{collection.description}</p>
                </article>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == 'collection'] {
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

  const collections = await sanityClient.fetch(query);
  console.log(collections)

  return {
    props: {
      collections,
    }
  }

}