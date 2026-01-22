"use client";

import { useState } from "react";
import TableGrid from "./table-grid";
import ItemGrid from "./item-grid";
import CartBox from "./cart";

export default function POSPage() {
  const [activeTable, setActiveTable] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (item: any) => {
    setCart((old) => {
      const found = old.find((x) => x.MenuItemID === item.MenuItemID);
      if (found) {
        return old.map((x) =>
          x.MenuItemID === item.MenuItemID
            ? { ...x, qty: x.qty + 1 }
            : x
        );
      }
      return [...old, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: number, q: number) => {
    setCart((old) =>
      old
        .map((x) =>
          x.MenuItemID === id ? { ...x, qty: q } : x
        )
        .filter((x) => x.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Point of Sale</h2>
          <p className="text-gray-500 mt-1">Select a table and add items to create an order</p>
        </div>
        {activeTable && (
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Selected: Table {activeTable.TableID}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <TableGrid
            active={activeTable}
            onPick={setActiveTable}
          />

          <ItemGrid onAdd={(item: any) => addToCart(item)} />
        </div>

        <div className="lg:col-span-4">
          <CartBox
            table={activeTable}
            cart={cart}
            updateQty={updateQty}
            clear={clearCart}
          />
        </div>
      </div>
    </div>
  );
}
