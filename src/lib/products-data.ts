// Product type definition
export interface Product {
  id: string;
  name: string;
  englishName: string;
  botanicalName?: string;
  category: string;
  description: string;
  images: string[];
  availableForms: string[];
  season: string;
  harvestSeason?: string;
  packing: string;
  weight: string;
  specifications: Record<string, string>;
  features: string[];
}

// Product database - shared between server and client components
export const productsDB: Record<string, Product> = {
  'fennel': {
    id: 'fennel',
    name: 'Fennel Seeds',
    englishName: 'Fennel Seeds',
    botanicalName: 'Foeniculum vulgare',
    category: 'Aromatic Seeds',
    description: 'Premium quality fennel seeds sourced directly from Egyptian farms. Our fennel seeds are known for their sweet, aromatic flavor with subtle licorice notes. Perfect for culinary applications, herbal teas, and food manufacturing.',
    images: [
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW5uZWwlMjBzZWVkc3xlbnwxfHx8fDE3NjQ3OTc2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1599909533601-fc4d95d7e5b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW5uZWwlMjBwbGFudHxlbnwxfHx8fDE3NjQ3OTc2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiJTIwZmllbGR8ZW58MXx8fHwxNzY0Nzk3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole Seeds',
      'Ground/Powder',
      'Crushed',
      'Essential Oil'
    ],
    season: 'Available all seasons',
    harvestSeason: 'March - June',
    packing: 'Polypropylene Bags',
    weight: '25 kg - 50 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Whole Seeds',
      'Purity': '99% min',
      'Moisture': '10% max',
      'Volatile Oil': '1.5% min',
      'Color': 'Greenish-Yellow',
      'Packaging': 'PP Bags',
      'Shelf Life': '24 months'
    },
    features: [
      'Sweet aromatic flavor',
      'High volatile oil content',
      'Hand-selected quality',
      'Food-grade certified',
      'Ideal for tea blends and cooking',
      'Export-standard packaging'
    ]
  },
  'parsley': {
    id: 'parsley',
    name: 'Parsley',
    englishName: 'Parsley',
    botanicalName: 'Petroselinum crispum',
    category: 'Herbs',
    description: 'Fresh, vibrant parsley sourced from the finest Egyptian farms. Our parsley is carefully dried to preserve its bright green color and distinctive flavor, making it perfect for seasoning, garnishing, and food manufacturing.',
    images: [
      'https://images.unsplash.com/photo-1692311358804-34b31f6ef43c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMHBhcnNsZXl8ZW58MXx8fHwxNzY0Nzk3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1572441713132-51b7c4c10d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHBhcnNsZXl8ZW58MXx8fHwxNzY0Nzk3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiJTIwZmllbGR8ZW58MXx8fHwxNzY0Nzk3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole leaves',
      'Crushed Leaves',
      'Leaves Selected Quality',
      'Powder',
      'Fine cut',
      'TBC cut'
    ],
    season: 'Available all seasons',
    harvestSeason: 'October - February',
    packing: 'Polypropylene Bags',
    weight: '10 kg - 25 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Leaves',
      'Color': 'Bright Green',
      'Moisture': '10% max',
      'Purity': '99% min',
      'Packaging': 'PP Bags',
      'Shelf Life': '18 months'
    },
    features: [
      'Vibrant green color',
      'Fresh aromatic flavor',
      'Multiple cut options',
      'Ideal for seasoning blends',
      'Food-grade quality',
      'Custom packaging available'
    ]
  },
  'dill-tips': {
    id: 'dill-tips',
    name: 'Dill Tips',
    englishName: 'Dill Tips',
    botanicalName: 'Anethum graveolens',
    category: 'Herbs',
    description: 'Fresh aromatic dill tips carefully harvested from Egyptian farms. Our dill maintains its distinctive flavor and aroma, perfect for culinary applications, pickling, and food manufacturing.',
    images: [
      'https://images.unsplash.com/photo-1582373778856-37fbec5f8529?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWxsJTIwaGVyYnMlMjBkcmllZHxlbnwxfHx8fDE3NjQ3OTc2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1530536306355-1bd7a4113d88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJtaW50JTIwbGVhdmVzJTIwZHJpZWR8ZW58MXx8fHwxNzY0Nzk3NzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1692311358804-34b31f6ef43c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMHBhcnNsZXl8ZW58MXx8fHwxNzY0Nzk3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole leaves',
      'Crushed Leaves',
      'Leaves Selected Quality',
      'Powder',
      'Fine cut'
    ],
    season: 'Available all seasons',
    harvestSeason: 'October - February',
    packing: 'Polypropylene Bags',
    weight: '15 kg - 25 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Leaves',
      'Moisture': '11% max',
      'Purity': '99% min',
      'Packaging': 'PP Bags',
      'Shelf Life': '18 months'
    },
    features: [
      'Strong aromatic flavor',
      'Bright green color',
      'Carefully selected leaves',
      'Ideal for pickling and seasoning',
      'Multiple processing options',
      'Premium export quality'
    ]
  },
  'dried-lemon': {
    id: 'dried-lemon',
    name: 'Dried Yellow Lemon',
    englishName: 'Dried Yellow Lemon',
    botanicalName: 'Citrus',
    category: 'Spices',
    description: 'Traditional dried yellow lemon, essential for authentic Middle Eastern and Persian cuisine. Our dried lemons are carefully processed to preserve their unique tangy flavor and aroma.',
    images: [
      'https://images.unsplash.com/photo-1717769071502-e9b5d06c5fc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMHllbGxvdyUyMGxlbW9ufGVufDF8fHx8MTc2NDc5NzY5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1601723897386-e5df0c749fb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdW1pbiUyMHNlZWRzfGVufDF8fHx8MTc2NDc5NzY5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1587493053604-f943541023aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJhd2F5JTIwc2VlZHN8ZW58MXx8fHwxNzY0Nzk3NzAyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Dried lemon'
    ],
    season: 'All year',
    packing: 'Polypropylene Bags',
    weight: '10 kg - 25 KG',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Whole dried fruit',
      'Color': 'Dark brown to black',
      'Moisture': '15% max',
      'Packaging': 'PP Bags',
      'Shelf Life': '24 months'
    },
    features: [
      'Authentic Middle Eastern ingredient',
      'Strong citrus flavor',
      'Natural sun-dried',
      'Perfect for stews and rice dishes',
      'Long shelf life',
      'Ready to use'
    ]
  },
  'meloukhia': {
    id: 'meloukhia',
    name: 'Meloukhia (Jew\'s Mallow)',
    englishName: 'Meloukhia (Jew\'s Mallow)',
    botanicalName: 'Corchorus olitorius',
    category: 'Herbs',
    description: 'Traditional Egyptian herb used in classic Middle Eastern cuisine. Our meloukhia is harvested at peak freshness and carefully dried to preserve its unique flavor and nutritional value.',
    images: [
      'https://images.unsplash.com/photo-1663521621949-ad0b42bcb3b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ3lwdGlhbiUyMGJhc2lsJTIwaGVyYnN8ZW58MXx8fHwxNzYxMzUwMTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1692311358804-34b31f6ef43c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMHBhcnNsZXl8ZW58MXx8fHwxNzY0Nzk3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1739922039476-39b394f93c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNpbCUyMGRyaWVkJTIwaGVyYnxlbnwxfHx8fDE3NjQ3OTc3MDB8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole leaves',
      'Crushed'
    ],
    season: 'Available all seasons',
    harvestSeason: 'May - August',
    packing: 'Cartons with PP bags',
    weight: '10 kg - 20 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Dried leaves',
      'Color': 'Dark green',
      'Moisture': '12% max',
      'Packaging': 'PP Bags',
      'Shelf Life': '18 months'
    },
    features: [
      'Authentic Egyptian ingredient',
      'Rich in nutrients',
      'Traditional processing methods',
      'Perfect for traditional soups',
      'Premium quality leaves',
      'Export standard packaging'
    ]
  },
  'basil': {
    id: 'basil',
    name: 'Basil',
    englishName: 'Sweet Basil',
    botanicalName: 'Ocimum basilicum',
    category: 'Herbs',
    description: 'Premium dried basil leaves with intense aroma and flavor. Our basil is carefully dried to preserve its essential oils and characteristic sweet, slightly peppery taste.',
    images: [
      'https://images.unsplash.com/photo-1739922039476-39b394f93c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNpbCUyMGRyaWVkJTIwaGVyYnxlbnwxfHx8fDE3NjQ3OTc3MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1663521621949-ad0b42bcb3b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ3lwdGlhbiUyMGJhc2lsJTIwaGVyYnN8ZW58MXx8fHwxNzYxMzUwMTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1572441713132-51b7c4c10d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHBhcnNsZXl8ZW58MXx8fHwxNzY0Nzk3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole leaves',
      'Crushed',
      'Powder'
    ],
    season: 'Available all seasons',
    harvestSeason: 'June - September',
    packing: 'Polypropylene Bags',
    weight: '10 kg - 25 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Dried leaves',
      'Color': 'Green',
      'Moisture': '10% max',
      'Purity': '99% min',
      'Packaging': 'PP Bags',
      'Shelf Life': '18 months'
    },
    features: [
      'Intense sweet aroma',
      'High essential oil content',
      'Perfect for Italian cuisine',
      'Multiple processing options',
      'Food-grade certified',
      'Export quality'
    ]
  },
  'peppermint': {
    id: 'peppermint',
    name: 'Peppermint',
    englishName: 'Peppermint',
    botanicalName: 'Mentha × piperita',
    category: 'Herbs',
    description: 'Refreshing Egyptian peppermint with high menthol content. Our peppermint leaves are perfect for teas, culinary applications, and essential oil extraction.',
    images: [
      'https://images.unsplash.com/photo-1530536306355-1bd7a4113d88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJtaW50JTIwbGVhdmVzJTIwZHJpZWR8ZW58MXx8fHwxNzY0Nzk3NzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1582373778856-37fbec5f8529?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWxsJTIwaGVyYnMlMjBkcmllZHxlbnwxfHx8fDE3NjQ3OTc2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1692311358804-34b31f6ef43c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMHBhcnNsZXl8ZW58MXx8fHwxNzY0Nzk3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole leaves',
      'Crushed',
      'Tea bags',
      'Essential oil'
    ],
    season: 'Available all seasons',
    harvestSeason: 'May - October',
    packing: 'Polypropylene Bags',
    weight: '10 kg - 25 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Dried leaves',
      'Color': 'Green',
      'Moisture': '10% max',
      'Menthol Content': '40% min',
      'Packaging': 'PP Bags',
      'Shelf Life': '24 months'
    },
    features: [
      'High menthol content',
      'Refreshing flavor',
      'Perfect for herbal teas',
      'Natural cooling effect',
      'Pharmaceutical grade available',
      'Export certified'
    ]
  },
  'cumin': {
    id: 'cumin',
    name: 'Cumin Seeds',
    englishName: 'Cumin Seeds',
    botanicalName: 'Cuminum cyminum',
    category: 'Aromatic Seeds',
    description: 'Premium Egyptian cumin seeds with distinctive earthy, warm flavor. Essential spice for Middle Eastern, Indian, and Latin American cuisines.',
    images: [
      'https://images.unsplash.com/photo-1601723897386-e5df0c749fb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdW1pbiUyMHNlZWRzfGVufDF8fHx8MTc2NDc5NzY5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW5uZWwlMjBzZWVkc3xlbnwxfHx8fDE3NjQ3OTc2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1587493053604-f943541023aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJhd2F5JTIwc2VlZHN8ZW58MXx8fHwxNzY0Nzk3NzAyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole seeds',
      'Ground/Powder',
      'Roasted'
    ],
    season: 'Available all seasons',
    harvestSeason: 'March - May',
    packing: 'Polypropylene Bags',
    weight: '25 kg - 50 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Whole seeds',
      'Purity': '99% min',
      'Moisture': '10% max',
      'Volatile Oil': '2.5% min',
      'Packaging': 'PP Bags',
      'Shelf Life': '24 months'
    },
    features: [
      'Distinctive earthy flavor',
      'High volatile oil content',
      'Essential cooking spice',
      'Hand-cleaned quality',
      'Food-grade certified',
      'Bulk quantities available'
    ]
  },
  'coriander': {
    id: 'coriander',
    name: 'Coriander Seeds',
    englishName: 'Coriander Seeds',
    botanicalName: 'Coriandrum sativum',
    category: 'Aromatic Seeds',
    description: 'Aromatic Egyptian coriander seeds with citrusy, slightly sweet flavor. Versatile spice used worldwide in curries, pickling, and baking.',
    images: [
      'https://images.unsplash.com/photo-1587493053604-f943541023aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJhd2F5JTIwc2VlZHN8ZW58MXx8fHwxNzY0Nzk3NzAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1601723897386-e5df0c749fb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdW1pbiUyMHNlZWRzfGVufDF8fHx8MTc2NDc5NzY5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW5uZWwlMjBzZWVkc3xlbnwxfHx8fDE3NjQ3OTc2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole seeds',
      'Ground/Powder',
      'Split'
    ],
    season: 'Available all seasons',
    harvestSeason: 'April - June',
    packing: 'Polypropylene Bags',
    weight: '25 kg - 50 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Whole seeds',
      'Purity': '99% min',
      'Moisture': '10% max',
      'Volatile Oil': '0.5% min',
      'Packaging': 'PP Bags',
      'Shelf Life': '24 months'
    },
    features: [
      'Citrusy sweet flavor',
      'Uniform seed size',
      'Essential spice blend ingredient',
      'Pharmaceutical grade available',
      'Steam sterilization option',
      'Custom packaging available'
    ]
  },
  'caraway': {
    id: 'caraway',
    name: 'Caraway Seeds',
    englishName: 'Caraway Seeds',
    botanicalName: 'Carum carvi',
    category: 'Aromatic Seeds',
    description: 'Premium Egyptian caraway seeds with warm, slightly sweet, and anise-like flavor. Traditional ingredient in European breads, cheeses, and liqueurs.',
    images: [
      'https://images.unsplash.com/photo-1587493053604-f943541023aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJhd2F5JTIwc2VlZHN8ZW58MXx8fHwxNzY0Nzk3NzAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW5uZWwlMjBzZWVkc3xlbnwxfHx8fDE3NjQ3OTc2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1601723897386-e5df0c749fb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdW1pbiUyMHNlZWRzfGVufDF8fHx8MTc2NDc5NzY5OXww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole seeds',
      'Ground/Powder'
    ],
    season: 'Available all seasons',
    harvestSeason: 'May - July',
    packing: 'Polypropylene Bags',
    weight: '25 kg - 50 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Whole seeds',
      'Purity': '99% min',
      'Moisture': '10% max',
      'Volatile Oil': '3% min',
      'Packaging': 'PP Bags',
      'Shelf Life': '24 months'
    },
    features: [
      'Warm anise-like flavor',
      'High essential oil content',
      'Traditional European ingredient',
      'Perfect for baking',
      'Food-grade certified',
      'Bulk export available'
    ]
  },
  'chamomile': {
    id: 'chamomile',
    name: 'Chamomile',
    englishName: 'Chamomile Flowers',
    botanicalName: 'Matricaria chamomilla',
    category: 'Herbs',
    description: 'Premium Egyptian chamomile flowers known worldwide for their superior quality. Our chamomile is carefully harvested and dried to preserve its delicate flavor and therapeutic properties.',
    images: [
      'https://images.unsplash.com/photo-1582373778856-37fbec5f8529?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWxsJTIwaGVyYnMlMjBkcmllZHxlbnwxfHx8fDE3NjQ3OTc2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1530536306355-1bd7a4113d88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJtaW50JTIwbGVhdmVzJTIwZHJpZWR8ZW58MXx8fHwxNzY0Nzk3NzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1663521621949-ad0b42bcb3b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ3lwdGlhbiUyMGJhc2lsJTIwaGVyYnN8ZW58MXx8fHwxNzYxMzUwMTUzfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole flowers',
      'Crushed',
      'Tea bags',
      'Essential oil'
    ],
    season: 'Available all seasons',
    harvestSeason: 'March - June',
    packing: 'Cartons with PP bags',
    weight: '10 kg - 20 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Dried flowers',
      'Color': 'Yellow center, white petals',
      'Moisture': '10% max',
      'Essential Oil': '0.4% min',
      'Packaging': 'PP Bags',
      'Shelf Life': '24 months'
    },
    features: [
      'World-renowned Egyptian quality',
      'Sweet apple-like aroma',
      'Perfect for herbal teas',
      'Pharmaceutical grade available',
      'Organic certified options',
      'Premium export packaging'
    ]
  },
  'marjoram': {
    id: 'marjoram',
    name: 'Marjoram',
    englishName: 'Sweet Marjoram',
    botanicalName: 'Origanum majorana',
    category: 'Herbs',
    description: 'Premium dried marjoram with sweet, slightly citrusy flavor. Egyptian marjoram is prized for its delicate taste and aroma, perfect for Mediterranean cuisine.',
    images: [
      'https://images.unsplash.com/photo-1663521621949-ad0b42bcb3b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ3lwdGlhbiUyMGJhc2lsJTIwaGVyYnN8ZW58MXx8fHwxNzYxMzUwMTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1739922039476-39b394f93c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNpbCUyMGRyaWVkJTIwaGVyYnxlbnwxfHx8fDE3NjQ3OTc3MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1692311358804-34b31f6ef43c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMHBhcnNsZXl8ZW58MXx8fHwxNzY0Nzk3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole leaves',
      'Rubbed',
      'Ground'
    ],
    season: 'Available all seasons',
    harvestSeason: 'June - September',
    packing: 'Polypropylene Bags',
    weight: '10 kg - 25 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Dried leaves',
      'Color': 'Gray-green',
      'Moisture': '10% max',
      'Volatile Oil': '0.5% min',
      'Packaging': 'PP Bags',
      'Shelf Life': '18 months'
    },
    features: [
      'Sweet aromatic flavor',
      'Mediterranean cuisine essential',
      'High essential oil content',
      'Multiple cut options',
      'Food-grade certified',
      'Export quality'
    ]
  },
  'thyme': {
    id: 'thyme',
    name: 'Thyme',
    englishName: 'Thyme',
    botanicalName: 'Thymus vulgaris',
    category: 'Herbs',
    description: 'Premium Egyptian thyme with strong aromatic flavor. Our thyme is carefully dried to preserve its essential oils and characteristic pungent taste.',
    images: [
      'https://images.unsplash.com/photo-1739922039476-39b394f93c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNpbCUyMGRyaWVkJTIwaGVyYnxlbnwxfHx8fDE3NjQ3OTc3MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1663521621949-ad0b42bcb3b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ3lwdGlhbiUyMGJhc2lsJTIwaGVyYnN8ZW58MXx8fHwxNzYxMzUwMTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1530536306355-1bd7a4113d88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJtaW50JTIwbGVhdmVzJTIwZHJpZWR8ZW58MXx8fHwxNzY0Nzk3NzAwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole leaves',
      'Rubbed',
      'Ground'
    ],
    season: 'Available all seasons',
    harvestSeason: 'June - September',
    packing: 'Polypropylene Bags',
    weight: '10 kg - 25 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Dried leaves',
      'Color': 'Gray-green',
      'Moisture': '10% max',
      'Volatile Oil': '1% min',
      'Packaging': 'PP Bags',
      'Shelf Life': '18 months'
    },
    features: [
      'Strong aromatic flavor',
      'High thymol content',
      'Essential culinary herb',
      'Perfect for seasoning blends',
      'Food-grade certified',
      'Bulk quantities available'
    ]
  },
  'oregano': {
    id: 'oregano',
    name: 'Oregano',
    englishName: 'Oregano',
    botanicalName: 'Origanum vulgare',
    category: 'Herbs',
    description: 'Robust Egyptian oregano with intense, slightly bitter flavor. Perfect for Italian cuisine, pizza, and Mediterranean dishes.',
    images: [
      'https://images.unsplash.com/photo-1663521621949-ad0b42bcb3b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ3lwdGlhbiUyMGJhc2lsJTIwaGVyYnN8ZW58MXx8fHwxNzYxMzUwMTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1739922039476-39b394f93c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNpbCUyMGRyaWVkJTIwaGVyYnxlbnwxfHx8fDE3NjQ3OTc3MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1692311358804-34b31f6ef43c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMHBhcnNsZXl8ZW58MXx8fHwxNzY0Nzk3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    availableForms: [
      'Whole leaves',
      'Crushed',
      'Ground'
    ],
    season: 'Available all seasons',
    harvestSeason: 'July - September',
    packing: 'Polypropylene Bags',
    weight: '10 kg - 25 kg',
    specifications: {
      'Origin': 'Egypt',
      'Form': 'Dried leaves',
      'Color': 'Green',
      'Moisture': '10% max',
      'Volatile Oil': '1.5% min',
      'Packaging': 'PP Bags',
      'Shelf Life': '18 months'
    },
    features: [
      'Intense robust flavor',
      'High carvacrol content',
      'Italian cuisine essential',
      'Perfect for pizza and pasta',
      'Steam sterilized option',
      'Export quality'
    ]
  }
};
