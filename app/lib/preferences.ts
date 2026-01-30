 export type UserPreferences = {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  compactMode: boolean;
};

const KEY = "user-preferences";

export function getPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return {
      theme: "system",
      notifications: true,
      compactMode: false,
    };
  }

  const raw = localStorage.getItem(KEY);
  return raw
    ? JSON.parse(raw)
    : {
        theme: "system",
        notifications: true,
        compactMode: false,
      };
}

export function savePreferences(prefs: UserPreferences) {
  localStorage.setItem(KEY, JSON.stringify(prefs));

  // Cookie for server awareness (optional)
  document.cookie = `prefs=${JSON.stringify(prefs)}; path=/; max-age=31536000`;
}
