import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await auth();

  // Only allow admin users
  if (!session?.user?.email?.endsWith('@collab-connect.com')) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard />
    </div>
  );
}
