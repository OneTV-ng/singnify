import { createContext, useContext, useReducer, useRef } from "react";
import { Track, PlayerStateType, PlayerActionType } from "@/app/lib/types";

// Create a context for the player


const initialState: PlayerStateType = {
  currentTrack: null,
  isPlaying: false,
  isMuted: false,
  isShuffle: false,
  repeatMode: "off",
  playbackSpeed: 1.0,
  volume: 1.0,
  queue: [],
  history: [],
  currentIndex: 0,
  currentTime: 0,
  loading: false,
  isFullScreen:false,
  error: null,
  playlist: [],
  currentTrackIndex: 0,
};

// Reducer function to handle state transitions
function playerReducer(state: PlayerStateType, action: PlayerActionType): PlayerStateType {
  switch (action.type) {
    case "SET_TRACK":
      return { 
        ...state, 
        currentTrack: action.payload, 
        currentIndex: state.queue.indexOf(action.payload) 
      };

    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
       // Existing cases
    case 'TOGGLE_FULLSCREEN':
      return {
        ...state,
        isFullScreen: action.payload !== undefined 
          ? action.payload 
          : !state.isFullScreen
      };
  

    case "TOGGLE_SHUFFLE":
      if (!state.isShuffle) {
        const currentTrack = state.queue[state.currentIndex];
        const remainingTracks = state.queue.slice(state.currentIndex + 1);
        const shuffledTracks = remainingTracks.sort(() => Math.random() - 0.5);
        const newQueue = [
          ...state.queue.slice(0, state.currentIndex + 1),
          ...shuffledTracks,
        ];
        return { ...state, isShuffle: true, queue: newQueue };
      } else {
        return { ...state, isShuffle: false };
      }

    case "PLAY":
      return { ...state, isPlaying: true };

    case "SET_VOLUME":
      return { ...state, volume: action.payload };

    case "SET_REPEAT_MODE":
      return { ...state, repeatMode: action.payload };

    case "SET_PLAYBACK_SPEED":
      return { ...state, playbackSpeed: action.payload };

    case "ADD_TO_QUEUE":
      return { ...state, queue: [...state.queue, action.payload] };
      

    case "REMOVE_FROM_QUEUE":
      return { 
        ...state, 
        queue: state.queue.filter((_, index) => index !== action.payload) 
      };

    case "NEXT_TRACK":
      const nextIndex = (state.currentIndex + 1) % state.queue.length;
      return { 
        ...state, 
        currentIndex: nextIndex, 
        currentTrack: state.queue[nextIndex] 
      };

    case "PREVIOUS_TRACK":
      const prevIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
      return { 
        ...state, 
        currentIndex: prevIndex, 
        currentTrack: state.queue[prevIndex] 
      };

    case "SEEK_TO":
      return { ...state, currentTime: action.payload };

    case "LOAD_PLAYLIST":
      
      return { 
        ...state, 
        queue: action.payload, 
        currentTrack: action.payload[0], 
        currentIndex: 0 
      };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "UPDATE_TIME":
      return { ...state, currentTime: action.payload };

    default:
      console.error(`Unhandled action type: ${action}`);
      return state;
  }
}

// PlayerProvider Component
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);

  const value = { state, dispatch, audioRef };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

// Custom Hook to use PlayerContext
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}


const PlayerContext = createContext<{
    state: PlayerStateType;
    dispatch: React.Dispatch<PlayerActionType>;
    audioRef: React.RefObject<HTMLAudioElement | null>; // Allow null here
  } | null>(null);
