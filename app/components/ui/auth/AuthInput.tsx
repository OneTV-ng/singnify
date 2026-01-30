// app/components/ui/auth/AuthInput.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AuthInput = ({
  label,
  type = 'text',
  error,
  ...props
}: {
  label: string;
  type?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-2">
    <Label htmlFor={props.id}>{label}</Label>
    <Input type={type} className={error ? 'border-destructive' : ''} {...props} />
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);