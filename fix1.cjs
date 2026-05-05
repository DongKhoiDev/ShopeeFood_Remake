const fs = require('fs');
const files = [
  'src/pages/Home.tsx',
  'src/pages/ItemDetail.tsx',
  'src/pages/RestaurantDetail.tsx',
  'src/features/dashboard/Dashboard.tsx',
  'src/features/products/Products.tsx',
  'src/features/restaurants/Restaurants.tsx'
];

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace("import { getRestaurantImage, getFoodImage } from '../lib/images';\\nimport { ImageWithFallback } from '../components/ImageWithFallback';", "import { getRestaurantImage, getFoodImage } from '../lib/images';\nimport { ImageWithFallback } from '../components/ImageWithFallback';");
    content = content.replace("import { getRestaurantImage, getFoodImage } from '../lib/images';\\nimport { ImageWithFallback } from '../components/ImageWithFallback';", "import { getRestaurantImage, getFoodImage } from '../lib/images';\nimport { ImageWithFallback } from '../components/ImageWithFallback';");
    fs.writeFileSync(file, content);
  } catch (e) {
    console.log(e);
  }
}
