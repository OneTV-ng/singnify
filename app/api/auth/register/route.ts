// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs-react";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Send to your API
    const res = await fetch('https://api.example.com/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password: hashedPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'Registration failed' },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: 'Registration successful' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}