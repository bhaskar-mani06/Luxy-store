export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Men's Watches",
    slug: "mens-watches",
    description: "Premium collection of men's watches"
  },
  {
    id: 2,
    name: "Ladies Watches",
    slug: "ladies-watches",
    description: "Elegant collection of ladies watches"
  },
  {
    id: 3,
    name: "Sunglasses",
    slug: "sunglasses",
    description: "Stylish and protective eyewear"
  },
  {
    id: 4,
    name: "Belts",
    slug: "belts",
    description: "Premium leather belts"
  },
  {
    id: 5,
    name: "Wallets",
    slug: "wallets",
    description: "High-quality leather wallets"
  },
  {
    id: 6,
    name: "Perfumes",
    slug: "perfumes",
    description: "Luxury fragrances for all occasions"
  }
];