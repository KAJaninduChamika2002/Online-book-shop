import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../utils/api';

const FALLBACK_SLIDES = [
  {
    title: 'Back to School Sale!',
    subtitle: 'Up to 30% off on bags, books & stationery',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&q=80',
    link: '/shop?category=school-bags',
    button: 'Shop Now',
    bg: 'from-blue-900/70',
  },
  {
    title: 'New Toy Collection',
    subtitle: 'Discover amazing toys for every age group',
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1400&q=80',
    link: '/shop?category=toys',
    button: 'Explore Toys',
    bg: 'from-purple-900/70',
  },
  {
    title: 'Art & Craft Kits',
    subtitle: "Unleash your child's creativity today",
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1400&q=80',
    link: '/shop?category=art-supplies',
    button: 'Shop Craft',
    bg: 'from-orange-900/70',
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);

  useEffect(() => {
    api.get('/banners?position=hero').then(({ data }) => {
      if (data.banners?.length) {
        setSlides(data.banners.map(b => ({
          title: b.title, subtitle: b.subtitle,
          image: b.image, link: b.link,
          button: b.button_text, bg: 'from-gray-900/70',
        })));
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-[400px] md:h-[520px] lg:h-[580px]"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg || 'from-gray-900/70'} to-transparent`} />
              <div className="absolute inset-0 flex items-center">
                <div className="container-custom">
                  <div className="max-w-xl animate-slide-up">
                    <div className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                      Limited Offer
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg text-white/90 mb-8">{slide.subtitle}</p>
                    <div className="flex gap-3">
                      <Link to={slide.link || '/shop'} className="btn-orange text-base px-8 py-3 shadow-lg">
                        {slide.button || 'Shop Now'}
                      </Link>
                      <Link to="/shop" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-semibold px-6 py-3 rounded-xl transition-colors">
                        View All
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
