import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock Data
export const mockProducts = [
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
  },
  {
    id: "p3",
    name: "Robe Longue Soie et Dentelle 'Dubaï'",
    description: "Inspirée des soirées orientales, cette robe en mousseline effet soie est rehaussée de délicates incrustations de dentelle dorée. Ceinture brodée incluse.",
    price: 245.00,
    category: "Femme",
    colors: ["Noir & Or", "Blanc cassé & Or"],
    sizes: ["M", "L", "XL"],
    images: [
      "https://picsum.photos/seed/dubaires1/800/1200",
      "https://picsum.photos/seed/dubaires2/800/1200"
    ],
    inStock: true,
  },
  {
    id: "p4",
    name: "Robe Fille 'Princesse d'Orient'",
    description: "Pour les grandes occasions. Robe enfant avec tulle superposé et petits détails brillants. Doublure en coton doux pour le confort de votre enfant.",
    price: 79.99,
    category: "Enfant",
    colors: ["Rose poudré", "Blanc"],
    sizes: ["4 ans", "6 ans", "8 ans", "10 ans"],
    images: [
      "https://picsum.photos/seed/kidprincesse1/800/1200",
      "https://picsum.photos/seed/kidprincesse2/800/1200"
    ],
    inStock: true,
  },
  {
    id: "p5",
    name: "Tunique Maxi Asymétrique 'Sahara'",
    description: "Coupe avant-gardiste pour cette tunique très longue à porter sur un palazzo ou un pantalon ajusté. Le col cheminée apporte une touche d'élégance structurée.",
    price: 95.00,
    category: "Femme",
    colors: ["Terracotta", "Olive"],
    sizes: ["S", "M", "L"],
    images: [
      "https://picsum.photos/seed/saharatunique1/800/1200",
      "https://picsum.photos/seed/saharatunique2/800/1200"
    ],
    inStock: false,
    isNew: true,
  },
  {
    id: "p6",
    name: "Hijab Mousseline Premium 'Coucher de Soleil'",
    description: "Voile en mousseline extra fine et opaque à double pli. Ne glisse pas facilement et offre un tombé parfaitement fluide pour vos drapés.",
    price: 24.99,
    category: "Accessoires",
    colors: ["Bordeaux", "Rose poudré", "Beige nude", "Noir profond"],
    sizes: ["Unique"],
    images: [
      "https://picsum.photos/seed/premiumhijab1/800/1200"
    ],
    inStock: true,
    isPopular: true,
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  const apiRouter = express.Router();
  
  apiRouter.get("/products", (req, res) => {
    // Optional filtering
    const category = req.query.category;
    const isNew = req.query.new === 'true';
    const isPopular = req.query.popular === 'true';
    const search = req.query.q as string;

    let filtered = [...mockProducts];
    
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (isNew) {
      filtered = filtered.filter(p => p.isNew);
    }
    if (isPopular) {
      filtered = filtered.filter(p => p.isPopular);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    res.json(filtered);
  });

  apiRouter.get("/products/:id", (req, res) => {
    const product = mockProducts.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });

  apiRouter.post("/checkout", (req, res) => {
    // Simulate checkout process
    res.json({ success: true, orderId: "ORD-" + Math.floor(Math.random() * 1000000) });
  });

  app.use("/api", apiRouter);

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
