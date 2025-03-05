const FEATURES = [
  { icon: '🚚', title: 'Free Delivery', desc: 'On orders above LKR 3,000 islandwide' },
  { icon: '✅', title: 'Quality Assured', desc: 'All products are safety tested & certified' },
  { icon: '↩️', title: 'Easy Returns', desc: '7-day hassle-free return policy' },
  { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted & safe transactions' },
  { icon: '🎁', title: 'Gift Wrapping', desc: 'Free gift wrapping on request' },
  { icon: '📞', title: '24/7 Support', desc: 'Always here to help you' },
];

export default function WhyUs() {
  return (
    <section className="py-14 bg-white border-t border-gray-100">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="section-title">Why Shop With Us?</h2>
          <p className="text-gray-500 mt-2">Sri Lanka's most trusted kids & toys store</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-3 transition-colors duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                {f.icon}
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">{f.title}</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
