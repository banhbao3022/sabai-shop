"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Order, OrderStatus } from "@/lib/types";

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
  clearOrders: () => void;
  getById: (id: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o,
          ),
        })),
      clearOrders: () => set({ orders: [] }),
      getById: (id) => get().orders.find((o) => o.id === id),
    }),
    {
      name: "sabai.orders",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
