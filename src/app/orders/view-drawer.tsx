"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrderItems } from "@/lib/api";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function ViewOrderDrawer({ data, close, onStatus }: any) {
  const { data: items = [] } = useQuery({
    queryKey: ["order-items", data.OrderID],
    queryFn: () => getOrderItems(data.OrderID)
  });

  const statuses = ["pending", "preparing", "served", "paid"];

  return (
    <Drawer open onOpenChange={close}>
      <DrawerContent className="p-6 space-y-6">
        <DrawerHeader>
          <DrawerTitle>Order #{data.OrderID}</DrawerTitle>
        </DrawerHeader>

        <div className="px-6 space-y-4">
          <div className="space-y-2 pb-4 border-b">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Table:</span> {data.TableID}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Total:</span> ₹{data.TotalAmount}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Order Items</h3>

            {items.length === 0 ? (
              <p className="text-sm text-gray-500">no items...</p>
            ) : (
              <div className="space-y-2 bg-gray-50 rounded p-3">
                {items.map((it: any) => (
                  <div
                    key={it.OrderItemID}
                    className="flex justify-between items-center py-2 border-b last:border-none text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{it.ItemName}</p>
                      <p className="text-xs text-gray-500">x {it.Quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-700">₹{it.SubTotal}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t">
            <p className="text-sm font-medium text-gray-900">Update Status:</p>

            <div className="flex flex-col gap-2">
              {statuses.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  className={`text-left capitalize ${
                    data.OrderStatus === s
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => onStatus(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
