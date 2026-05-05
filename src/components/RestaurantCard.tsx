import React from 'react';
import { Star, Timer, Bike, Heart } from 'lucide-react';
import { Restaurant } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { getRestaurantImage } from '../lib/images';
import { ImageWithFallback } from './ImageWithFallback';

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="block group">
      <motion.article 
        whileHover={{ y: -4 }}
        className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col group cursor-pointer h-full hover:shadow-xl hover:shadow-orange-100/30 transition-all duration-300"
      >
        <div className="relative h-32 w-full overflow-hidden">
          <ImageWithFallback
            src={getRestaurantImage(restaurant.image, restaurant.id)}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            fallbackType="restaurant"
            fallbackId={restaurant.id}
          />
          
          <div className="absolute top-3 left-3 bg-[#ee4d2d] text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg uppercase tracking-widest">
            Partner
          </div>
          
          {restaurant.isPromo && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#ee4d2d] text-[8px] font-black px-2 py-1 rounded-lg shadow-sm uppercase tracking-widest border border-orange-100">
              SALE
            </div>
          )}

          <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg">
            {restaurant.deliveryTime.split('-')[0]} Phút
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h4 className="font-black text-xs text-gray-900 line-clamp-1 group-hover:text-[#ee4d2d] transition-colors mb-1 uppercase tracking-tight">{restaurant.name}</h4>
          
          <p className="text-[9px] font-bold text-gray-400 line-clamp-1 uppercase tracking-tighter mb-4">
            {restaurant.categories.slice(0, 2).join(' • ')}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 text-orange-500 fill-current" />
              <span className="text-[10px] font-black text-orange-600">{restaurant.rating}</span>
            </div>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">{restaurant.reviewCount} ĐÃ BÁN</span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
