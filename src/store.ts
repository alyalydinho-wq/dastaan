import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  colors: string[];
  sizes: string[];
  images: string[];
  inStock: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  badges: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

interface AppState {
  cart: CartItem[];
  wishlist: Product[];
  products: Product[];
  marqueeOfferText: string;
  adminUser: { email: string } | null;
  adminCredentials: { email: string; password: string };
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  setMarqueeOfferText: (text: string) => void;
  // Product Management
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  // Admin Auth
  login: (email: string) => void;
  logout: () => void;
  updateAdminCredentials: (credentials: { email?: string; password?: string }) => void;
}

const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Robe Abaya Brodée Émeraude",
    description: "Une élégante abaya avec broderies artisanales sur les manches et l'encolure. Tissu fluide de haute qualité, parfait pour les occasions spéciales ou l'Aïd. Coupe évasée offrant une modestie absolue sans compromettre l'allure.",
    price: 189.99,
    category: "Femme",
    colors: ["Émeraude", "Noir", "Bordeaux"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://picsum.photos/seed/abayaemerald1/800/1200",
      "https://picsum.photos/seed/abayaemerald2/800/1200"
    ],
    inStock: true,
    isNew: true,
    badges: ["Nouveau"]
  },
  {
    id: "p2",
    name: "Ensemble Coordonné Tunique & Pantalon Minimaliste",
    description: "Ensemble deux pièces en lin mélangé respirant. Tunique asymétrique longue à l'arrière avec pantalon ample assorti. Un classique intemporel pour un look raffiné de tous les jours.",
    price: 129.50,
    category: "Femme",
    colors: ["Beige clair", "Sable", "Bleu marine"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://picsum.photos/seed/linenensemble1/800/1200",
      "https://picsum.photos/seed/linenensemble2/800/1200"
    ],
    inStock: true,
    isPopular: true,
    badges: ["Coup de cœur"]
  },
  {
    id: "p4",
    name: "Robe Fille 'Princesse d'Orient'",
    description: "Pour les grandes occasions. Robe enfant avec tulle superposé et petits détails brillants. Doublure en coton doux pour le confort de votre enfant.",
    price: 79.99,
    salePrice: 59.99,
    category: "Enfant",
    colors: ["Rose poudré", "Blanc"],
    sizes: ["4 ans", "6 ans", "8 ans", "10 ans"],
    images: [
      "https://picsum.photos/seed/kidprincesse1/800/1200",
      "https://picsum.photos/seed/kidprincesse2/800/1200"
    ],
    inStock: true,
    badges: ["Promo"]
  }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      products: initialProducts,
      marqueeOfferText: "GET ONE 50% OFF ✦ GET ONE 50% OFF ✦ GET ONE 50% OFF ✦",
      adminUser: null,
      adminCredentials: { email: 'admin@admin.com', password: 'admin123' },
      addToCart: (item) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (c) =>
              c.product.id === item.product.id &&
              c.selectedColor === item.selectedColor &&
              c.selectedSize === item.selectedSize
          );

          if (existingItemIndex >= 0) {
            const newCart = [...state.cart];
            newCart[existingItemIndex].quantity += item.quantity;
            return { cart: newCart };
          }
          return { cart: [...state.cart, item] };
        }),
      removeFromCart: (productId, color, size) =>
        set((state) => ({
          cart: state.cart.filter(
            (c) =>
              !(c.product.id === productId && c.selectedColor === color && c.selectedSize === size)
          ),
        })),
      updateQuantity: (productId, color, size, quantity) =>
        set((state) => ({
          cart: state.cart.map((c) =>
            c.product.id === productId && c.selectedColor === color && c.selectedSize === size
              ? { ...c, quantity }
              : c
          ),
        })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (product) =>
        set((state) => {
          const isWishlisted = state.wishlist.some((p) => p.id === product.id);
          if (isWishlisted) {
            return { wishlist: state.wishlist.filter((p) => p.id !== product.id) };
          }
          return { wishlist: [...state.wishlist, product] };
        }),
      setMarqueeOfferText: (text) => set({ marqueeOfferText: text }),
      setProducts: (products) => set({ products }),
      addProduct: (product) => 
        set((state) => ({ products: [product, ...state.products] })),
      updateProduct: (product) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === product.id ? product : p)),
        })),
      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),
      login: (email) => set({ adminUser: { email } }),
      logout: () => set({ adminUser: null }),
      updateAdminCredentials: (credentials) =>
        set((state) => ({
          adminCredentials: { ...state.adminCredentials, ...credentials },
        })),
    }),
    {
      name: 'ecommerce-storage-v2', // Changed name to force refresh with new structure if needed, or keep same to try and merge
    }
  )
);
