import React from 'react'

const TrustedBar = () => {
    const items = [
        {
            image:"https://mantraherbal.in/cdn/shop/files/Artboard_1.png?v=1754030614&width=180"
        },
        {
            image:"https://mantraherbal.in/cdn/shop/files/Artboard_4.png?v=1754030614&width=180"
        },
        {
            image:"https://mantraherbal.in/cdn/shop/files/Artboard_6.png?v=1754030614&width=180"
        },
        {
            image:"https://mantraherbal.in/cdn/shop/files/Artboard_2.png?v=1754030614&width=180"
        },
        {
            image:"https://mantraherbal.in/cdn/shop/files/Artboard_10.png?v=1754030614&width=180"
        },
        {
            image:"https://mantraherbal.in/cdn/shop/files/Artboard_3.png?v=1754030614&width=180"
        },
        {
            image:"https://mantraherbal.in/cdn/shop/files/Artboard_8.png?v=1754030614&width=180"
        },
        {
            image:"https://mantraherbal.in/cdn/shop/files/Artboard_1.png?v=1754030614&width=180"
        },
        {
            image:"https://mantraherbal.in/cdn/shop/files/Artboard_1.png?v=1754030614&width=180"
        },
        {
            image:"https://mantraherbal.in/cdn/shop/files/Artboard_9.png?v=1754030614&width=180"
        }
        
    ]

  return (
    <section className='py-10'>
        <div>
            <h2 className='text-2xl font-bold text-center mb-5'>Trusted  By  Us</h2>
        </div>
        <div className='flex justify-center items-center gap-4'>
            {items.map((item, index) => (
                <div className='w-20' key={index}>
                    <img className='h-full w-full object-cover' src={item.image} alt="" />
                </div>
            ))}
        </div>
    </section>
  )
}

export default TrustedBar