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
    name: "Ensemble Femme",
    description: "Toute les tailles disponible, pour femmes",
    price: 99.00,
    salePrice: 75.00,
    category: "Femme",
    colors: ["Bleu/Noir"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/ensemble-femme-1.jpg",
      "/ensemble-femme-2.jpg"
    ],
    inStock: true,
    isNew: true,
    badges: ["Promo"]
  },
  {
    id: "p2",
    name: "Ensemble Femme",
    description: "Toute les tailles disponible, pour femmes",
    price: 99.00,
    salePrice: 75.00,
    category: "Femme",
    colors: ["Beige/Noir", "Autre"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/IMG_2825.webp",
      "/IMG_2826.webp",
      "/IMG_2827.webp"
    ],
    inStock: true,
    isNew: true,
    badges: ["Promo"]
  },
  {
    id: "p3",
    name: "Chemisier lin Vert",
    description: "Toute les tailles disponible, plusieurs couleurs, pour femmes",
    price: 135.00,
    salePrice: 89.00,
    category: "Femme",
    colors: ["Vert", "Autres couleurs"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/chemisierlin1.webp",
      "/chemisierlin2.webp",
      "/chemisierlin3.webp"
    ],
    inStock: true,
    isNew: true,
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
      name: 'ecommerce-storage-v5', // Changed name to force refresh with new structure if needed, or keep same to try and merge
    }
  )
);
