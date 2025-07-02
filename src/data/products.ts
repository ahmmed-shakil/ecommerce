import { Product } from '@/store/slices/productsSlice';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    price: 1199,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500'
    ],
    category: 'Phones',
    description: 'The most advanced iPhone ever with titanium design and A18 Pro chip.',
    specifications: {
      'Display': '6.9-inch Super Retina XDR',
      'Chip': 'A18 Pro',
      'Camera': '48MP Main, Ultra Wide, Telephoto',
      'Battery': 'Up to 33 hours video playback',
      'Storage': '256GB, 512GB, 1TB'
    },
    inStock: true,
    stockCount: 25,
    rating: 4.8,
    reviewCount: 342,
    isNew: true,
    isFeatured: true,
    discount: 8
  },
  {
    id: '2',
    name: 'MacBook Pro 16" M4',
    brand: 'Apple',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
    ],
    category: 'Laptops',
    description: 'Supercharged by M4 Pro and M4 Max chips. Built for Apple Intelligence.',
    specifications: {
      'Display': '16.2-inch Liquid Retina XDR',
      'Chip': 'Apple M4 Pro',
      'Memory': '18GB unified memory',
      'Storage': '512GB SSD',
      'Battery': 'Up to 24 hours'
    },
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviewCount: 156,
    isNew: true,
    isFeatured: true
  },
  {
    id: '3',
    name: 'AirPods Pro (3rd Gen)',
    brand: 'Apple',
    price: 249,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500',
    images: [
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500'
    ],
    category: 'Audio',
    description: 'Personalized Spatial Audio. Adaptive Transparency. Up to 2x more Active Noise Cancellation.',
    specifications: {
      'Chip': 'H2',
      'Battery': 'Up to 6 hours listening time',
      'Features': 'Active Noise Cancellation, Spatial Audio',
      'Charging': 'Lightning, MagSafe, Qi wireless'
    },
    inStock: true,
    stockCount: 50,
    rating: 4.7,
    reviewCount: 892,
    isFeatured: true
  },
  {
    id: '4',
    name: 'iPad Air M2',
    brand: 'Apple',
    price: 599,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500'
    ],
    category: 'Tablets',
    description: 'Serious performance in a seriously thin and light design.',
    specifications: {
      'Display': '10.9-inch Liquid Retina',
      'Chip': 'Apple M2',
      'Storage': '128GB, 256GB, 512GB, 1TB',
      'Camera': '12MP Wide, 12MP Ultra Wide'
    },
    inStock: true,
    stockCount: 30,
    rating: 4.6,
    reviewCount: 234
  },
  {
    id: '5',
    name: 'Apple Watch Ultra 2',
    brand: 'Apple',
    price: 799,
    image: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=500',
    images: [
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=500',
      'https://images.unsplash.com/photo-1510017098667-27ddefef7174?w=500'
    ],
    category: 'Wearables',
    description: 'The most rugged and capable Apple Watch. Designed for endurance.',
    specifications: {
      'Display': '49mm Retina',
      'Battery': 'Up to 36 hours',
      'Water Resistance': '100 meters',
      'GPS': 'Precision dual-frequency GPS'
    },
    inStock: true,
    stockCount: 20,
    rating: 4.8,
    reviewCount: 167,
    isNew: true
  },
  {
    id: '6',
    name: 'Magic Mouse',
    brand: 'Apple',
    price: 79,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'
    ],
    category: 'Accessories',
    description: 'Multi-Touch surface allows you to perform simple gestures.',
    specifications: {
      'Connectivity': 'Bluetooth',
      'Battery': 'Lightning rechargeable',
      'Compatibility': 'Mac, iPad'
    },
    inStock: true,
    stockCount: 100,
    rating: 4.2,
    reviewCount: 445
  },
  {
    id: '7',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
    ],
    category: 'Phones',
    description: 'AI smartphone with advanced camera and S Pen functionality.',
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '200MP Main + AI features',
      'S Pen': 'Built-in S Pen',
      'Storage': '256GB, 512GB, 1TB'
    },
    inStock: true,
    stockCount: 35,
    rating: 4.7,
    reviewCount: 523,
    isFeatured: true
  },
  {
    id: '8',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    price: 399,
    originalPrice: 449,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    category: 'Audio',
    description: 'Industry-leading noise canceling with premium sound quality.',
    specifications: {
      'Driver': '30mm',
      'Battery': 'Up to 30 hours',
      'Charging': 'USB-C, Quick charge',
      'Features': 'Industry-leading noise canceling'
    },
    inStock: true,
    stockCount: 45,
    rating: 4.8,
    reviewCount: 789,
    discount: 11
  }
];