import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Active Tables</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-blue-600">12</CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Orders Today</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-blue-600">43</CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-blue-600">₹12,500</CardContent>
      </Card>
    </div>
  );
}
