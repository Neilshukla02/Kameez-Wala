export const categories = [
  {
    id: 'Kameez',
    label: "Men's Ethnic Wear",
    short: 'Kameez',
    description: 'Tailored kurtas and kameez silhouettes designed for weddings, festivities, and refined evenings.',
    image:
      'https://images.unsplash.com/photo-1621786030738-d8d6f9f8ec5b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'Perfumes',
    label: 'Luxury Fragrance',
    short: 'Perfumes',
    description: 'Oud, amber, floral, and musky compositions presented like collectible wardrobe pieces.',
    image:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'Shoes',
    label: 'Branded Shoes',
    short: 'Shoes',
    description: 'Sneakers, formal pairs, and festive footwear crafted to complete the look.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'Watches',
    label: 'Premium Watches',
    short: 'Watches',
    description: 'Timepieces with polished cases, deep dials, and understated statement energy.',
    image:
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80',
  },
]

export const shopFilters = ['All', ...categories.map((category) => category.id)]
