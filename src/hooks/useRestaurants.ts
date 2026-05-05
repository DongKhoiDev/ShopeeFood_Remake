import { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { MOCK_RESTAURANTS } from '../constants';
import { useAuth } from '../context/AuthContext';

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, user } = useAuth(); // needed to seed as admin

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'restaurants'));
        if (querySnapshot.empty && isAdmin && user) {
          // Seed the database if empty
          console.log("Seeding database...");
          const seeded = await seedRestaurants(user.id);
          setRestaurants(seeded);
        } else if (!querySnapshot.empty) {
          const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRestaurants(list);
        } else {
          // If not admin and empty, just use MOCK locally until admin logs in to seed
          setRestaurants(MOCK_RESTAURANTS);
        }
      } catch (e) {
        console.error('Failed to fetch restaurants from firestore', e);
        setRestaurants(MOCK_RESTAURANTS); // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [isAdmin, user]);

  return { restaurants, loading };
}

async function seedRestaurants(adminId: string) {
  try {
    const list = [];
    for (const r of MOCK_RESTAURANTS) {
      const docRef = doc(db, 'restaurants', r.id);
      const data = {
        name: r.name,
        image: r.image || null,
        rating: r.rating || null,
        reviewCount: r.reviewCount || "0",
        reviews: parseInt(r.reviewCount || "0") || 0,
        categories: r.categories || [],
        address: r.address || null,
        distance: r.distance || null,
        deliveryTime: r.deliveryTime || null,
        deliveryFee: r.deliveryFee || null,
        isPromo: r.isPromo || false,
        isPartner: (r as any).isPartner || false,
        ownerId: adminId,
        menu: r.menu || [],
        createdAt: Date.now()
      };
      await setDoc(docRef, data);
      list.push({ id: r.id, ...data });
    }
    return list;
  } catch (e) {
     console.error("Seeding error", e);
     return MOCK_RESTAURANTS;
  }
}
