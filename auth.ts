import NextAuth, { DefaultSession } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from 'next/headers';
import { 
  AuthResponse, 
  MemberData, 
  UserType,
  AuthState 
} from '@/app/lib/types';
import { AUTH_CONSTANTS } from '@/app/constants/auth';

// Extend the built-in session type
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: MemberData & DefaultSession["user"];
  }
  interface User extends MemberData {}
}


 type LoginCredentials = {
    email: string;
    password: string;
  }
// Initial auth state
export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "Enter your email" 
        },
        password: { 
          label: "Password", 
          type: "password",
          placeholder: "Enter your password" 
        }
      },
      async authorize(credentials): Promise< any|LoginCredentials| {} > {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        try {
          const user = await loginUser({
            email: credentials.email,
            password: credentials.password
          });
          return user;
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Invalid credentials');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.Token;
        token.userData = user;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      session.user = token.userData as MemberData;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirect URLs
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    newUser: '/auth/register'
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === 'development',
});



async function loginUser(credentials: any): Promise<MemberData|null> {
  const formData = new FormData();
  formData.append('id', credentials.email);
  formData.append('password', credentials.password);
  formData.append('API_KEY', AUTH_CONSTANTS.API_KEY);

  const response = await fetch('https://singnify.com/api/v2/php/login.php', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data: AuthResponse = await response.json();

  if (data.status !== '200' || !data.member_data?.Token) {
    throw new Error(data.message || 'Authentication failed');
  }

  // Store in server-side cookies
  if (data.status === '200') {
    // Store auth token in server-side cookies
    const cookieStore = await cookies();
     cookieStore.set('auth_token', data.member_data.Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 1 day
    });

  return data.member_data;

}

return null;
}


// Server-side logout function
async function logoutUser(): Promise<void> {
  cookies();
  await signOut({ redirectTo:'/auth/signin' });
}

// Helper function to get current session with proper typing
async function getCurrentUser(): Promise<MemberData | null> {
  const session = await auth();
  return session?.user ?? null;
}

export { logoutUser, getCurrentUser }