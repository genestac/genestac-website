"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { toast } from "react-hot-toast";
import { formatINR } from "@/lib/currency";
import { supabase } from "@/lib/supabase";
import AgeGenderPrompt from "@/components/AgeGenderPopUp";

interface AgeGenderInfo {
  age?: number;
  gender?: "male" | "female" | "other";
}

async function getUserAgeGender(userId: string): Promise<AgeGenderInfo | null> {
  const { data, error } = await supabase
    .from("users")
    .select("metadata")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  const meta = data.metadata as Record<string, any> || {};
  if (meta.age && meta.gender) return { age: meta.age, gender: meta.gender };
  return null;
}

async function updateUserAgeGender(userId: string, age: number, gender: string) {
  const { data } = await supabase
    .from("users")
    .select("metadata")
    .eq("id", userId)
    .single();
  const meta = (data?.metadata as Record<string, any>) || {};
  await supabase.from("users").update({ metadata: { ...meta, age, gender } }).eq("id", userId);
}

export interface CartItem {
  id?: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  category?: "product" | "plan";
  planId?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: {
      id?: string;
      name: string;
      price: number;
      image: string;
      category?: CartItem["category"];
      planId?: string;
    },
    options?: { showToast?: boolean },
  ) => void;
  removeFromCart: (name: string) => void;
  changeQty: (index: number, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  cartSummaryText: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function syncCartFromDb() {
  const token = await getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch("/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const items: any[] = await res.json();
    return items.map((item: any) => ({
      id: item.plan_id,
      name: item.plans?.cart_name || item.plans?.name || "Plan",
      price: Number(item.plans?.price) || 0,
      image: "/cropped-Genestac-Logo-1-300x300-removebg-preview.png",
      qty: 1,
      category: "plan" as const,
      planId: item.plan_id,
    }));
  } catch {
    return null;
  }
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showAgePrompt, setShowAgePrompt] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    syncCartFromDb().then((items) => {
      if (items && items.length > 0) setCart(items);
      setLoaded(true);
    });
  }, []);

  const addProductToCart = useCallback((product: any, options: any = {}) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.name === product.name);
      if (idx > -1) {
        const newCart = [...prev];
        newCart[idx] = { ...newCart[idx], qty: newCart[idx].qty + 1 };
        return newCart;
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, qty: 1, category: product.category, planId: product.planId }];
    });
    if (product.planId) {
      getAuthToken().then((token) => {
        if (!token) return;
        fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ planId: product.planId }) }).catch(() => {});
      });
    }
    if (options.showToast !== false) toast.success("Added to cart", { duration: 2000 });
  }, []);

  const addToCart = useCallback(
    (product: any, options: any = {}) => {
      if (!userId) {
        setPendingProduct({ product, options });
        setShowAgePrompt(true);
        return;
      }
      getUserAgeGender(userId).then((info) => {
        if (info) {
          addProductToCart(product, options);
        } else {
          setPendingProduct({ product, options });
          setShowAgePrompt(true);
        }
      });
    },
    [userId, addProductToCart],
  );

  const handleAgeSave = useCallback(
    async (age: number, gender: "male" | "female" | "other") => {
      if (userId) await updateUserAgeGender(userId, age, gender);
      if (pendingProduct) {
        addProductToCart(pendingProduct.product, pendingProduct.options);
        setPendingProduct(null);
      }
    },
    [userId, pendingProduct, addProductToCart],
  );

  const handleAgeClose = useCallback(() => {
    if (pendingProduct) {
      addProductToCart(pendingProduct.product, pendingProduct.options);
      setPendingProduct(null);
    }
    setShowAgePrompt(false);
  }, [pendingProduct, addProductToCart]);

  const removeFromCart = useCallback((name: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.name === name);
      if (item?.planId) {
        getAuthToken().then((token) => {
          if (!token) return;
          fetch(`/api/cart?planId=${item.planId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
        });
      }
      return prev.filter((i) => i.name !== name);
    });
  }, []);

  const changeQty = useCallback((index: number, delta: number) => {
    setCart((prev) => {
      if (!prev[index]) return prev;
      const newQty = prev[index].qty + delta;
      const newCart = [...prev];
      if (newQty <= 0) newCart.splice(index, 1);
      else newCart[index] = { ...newCart[index], qty: newQty };
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    getAuthToken().then((token) => {
      if (!token) return;
      fetch("/api/cart", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    });
  }, []);

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const getCartSummaryText = () => {
    if (cart.length === 0) return "Empty Cart";
    let text = "Order Summary:\n\n";
    cart.forEach((i) => { text += `- ${i.qty}x ${i.name} (${formatINR(i.price)} each) = ${formatINR(i.price * i.qty)}\n`; });
    text += `\nTOTAL AMOUNT: ${formatINR(subtotal)}`;
    return text;
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQty, clearCart, totalItems, subtotal, cartSummaryText: getCartSummaryText() }}>
      {children}
      <AgeGenderPrompt isOpen={showAgePrompt} onClose={handleAgeClose} onSave={handleAgeSave} />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
