
// app/components/ui/auth/AuthContainer.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </div>
);
