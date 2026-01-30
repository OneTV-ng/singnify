// @/app/context/AppProvider.tsx
"use client"
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './ThemeContext';
import { PlayerProvider } from './PlayerContext';
import { ShowMessageProvider } from './ShowMessageContext';
import { SearchProvider } from './SearchContext';

//import { AuthProvider } from './AuthContext';

interface AppProviderProps {
  children: ReactNode;
  session?: any; // You can type this properly based on your next-auth session type
}

export  function AppProvider({ children, session }: AppProviderProps) {
  return (
    <SessionProvider session={session}>
      <SearchProvider>
        <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            themes={['light', 'dark', 'neon']}
          >         <ShowMessageProvider>

            <PlayerProvider>
              {children}
            </PlayerProvider>
                     </ShowMessageProvider>

          </ThemeProvider>
      </SearchProvider>
    </SessionProvider>
  );
}

