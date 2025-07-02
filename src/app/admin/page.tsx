import { getAdminConfig } from './actions';
import AdminForm from './AdminForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminPage() {
  const config = await getAdminConfig();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Admin Settings</CardTitle>
          <CardDescription>
            Manage the application's configuration here. Changes will be saved to 
            <code className="mx-1 px-1 py-0.5 bg-muted rounded-sm text-sm">src/data/admin-config.json</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminForm initialConfig={config} />
        </CardContent>
      </Card>
    </div>
  );
}
