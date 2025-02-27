import { Star } from 'lucide-react';

export default function StarRating({ rating, size = 16, showCount, count }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
      {showCount && <span className="text-sm text-gray-400 ml-1">({count})</span>}
    </div>
  );
}
