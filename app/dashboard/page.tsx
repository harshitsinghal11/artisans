import { Card, CardContent, CardHeader } from "@/src/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="container p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your catalog and view insights.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <h3 className="font-medium text-foreground">Total Products</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h3 className="font-medium text-foreground">Published</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">0</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Your Products</h2>
        <Card className="p-8 text-center border-dashed border-2">
          <p className="text-muted-foreground">You haven't added any products yet.</p>
        </Card>
      </div>
    </div>
  )
}
