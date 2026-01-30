// utils/code.ts
export interface Example {
  id: number;
  name: string;
  isActive: boolean;
}

export function greet(name: string): string {
  return `Hello, ${name}!`;
}
