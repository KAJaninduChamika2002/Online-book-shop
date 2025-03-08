import { useEffect, useState } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import CategorySection from '../components/home/CategorySection';
import ProductSection from '../components/home/ProductSection';
import PromoBanners from '../components/home/PromoBanners';
import WhyUs from '../components/home/WhyUs';
import api from '../utils/api';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [f, b, n] = await Promise.all([
          api.get('/products?featured=true&limit=6'),
          api.get('/products?bestseller=true&limit=6'),
          api.get('/products?newArrival=true&limit=6'),
        ]);
        setFeatured(f.data.products || []);
        setBestsellers(b.data.products || []);
        setNewArrivals(n.data.products || []);
      } catch {
        // API not ready yet — sections will show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div>
      <HeroSlider />
      <CategorySection />

      <ProductSection
        title="Featured Products"
        subtitle="Hand-picked just for you"
        badge="Editor's Choice"
        products={featured}
        loading={loading}
        viewAllLink="/shop?featured=true"
      />

      <PromoBanners />

      <div className="bg-gray-50">
        <ProductSection
          title="Best Sellers"
          subtitle="Most loved by our customers"
          badge="Hot 🔥"
          products={bestsellers}
          loading={loading}
          viewAllLink="/shop?bestseller=true"
        />
      </div>

      <ProductSection
        title="New Arrivals"
        subtitle="Fresh picks just landed"
        badge="Just In"
        products={newArrivals}
        loading={loading}
        viewAllLink="/shop?newArrival=true"
      />

      <WhyUs />
    </div>
  );
}
