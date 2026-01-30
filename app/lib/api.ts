// services/api.ts
import { Track , Artist,HeroSlide,NewsItem } from '@/app/lib/types';



const baseURL='https://a51.1tv.ng/src/api';

const getData = async (endpoint: string) => {
  try {
    //${endpoint}
    const response = await fetch(`//a51.1tv.ng/src/api`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Replace with your actual token
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Removed duplicate getData function
 const API_URL : String|undefined = process.env.NEXT_PUBLIC_API_URL;
  const APIP_URL : String|undefined  = process.env.NEXT_PUBLIC_APIP_URL;
 
  console.log(API_URL);




// Define the Track interface


// Original data
const rawData = [
  {
    "id": 6008,
    "track_name": "WINNER",
    "label": "JAYSILVER",
    "genre": "African",
    "image": "https://nextxtar.com/assets/images/CoverArt/Thumb/1661811849_cover_art_29584771.jpg",
    "audio": "https://nextxtar.com/assets/music/WINNER-JAYSILVER.mp3",
    "duration": "210",
    "no_plays": 30,
    "actor": ""
  },
  {
    "id": 8577,
    "track_name": "Future (Xhosa GAARA) Feat. HOME BOYS EL",
    "label": "Unclee Manando",
    "genre": "Hip-Hop",
    "image": "https://nextxtar.com/assets/images/CoverArt/Thumb/1692436576_cover_art_913523741.png",
    "audio": "https://nextxtar.com/assets/music/Future-(Xhosa-GAARA)-Feat.-HOME-BOYS-EL-Unclee-Manando-.mp3",
    "duration": "149",
    "no_plays": 22,
    "actor": null
  },
  // Add the other objects here...
];

// Function to convert the raw data to the Track interface
const convertToTracks = (data: any[]): Track[] => {
  return data.map(item => ({
    id: item.id,
    track_name: item.track_name,
    artist: {
      id: item.id, // Assuming the artist has the same ID as the track
      name: item.label,
    },
    url: item.audio,
    genre: item.genre,
    info: item.actor, // Assuming this is the artist's info 
    duration: item.duration, // Keeping as a string
    image: item.image,
    plays: item.no_plays,
    releaseDate: '', // No release date in raw data, can set as empty or use current date
    isLiked: false, // Default to false, or set based on your app's logic
    label: item.label,
    audio: item.audio,
  }));
};

// Example usage
//const tracks = convertToTracks(rawData);

const backTrack: any[] = convertToTracks([{"id":6008,"track_name":"WINNER","label":"JAYSILVER","genre":"African","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1661811849_cover_art_29584771.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/WINNER-JAYSILVER.mp3","duration":"210","no_plays":30,"actor":""},{"id":8577,"track_name":"Future (Xhosa GAARA) Feat. HOME BOYS EL","label":"Unclee Manando","genre":"Hip-Hop","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1692436576_cover_art_913523741.png","audio":"https:\/\/nextxtar.com\/assets\/music\/Future-(Xhosa-GAARA)-Feat.-HOME-BOYS-EL-Unclee-Manando-.mp3","duration":"149","no_plays":22,"actor":null},{"id":8576,"track_name":"Khon'into engihluphayo","label":"FraternalTG","genre":"African","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1642682690_cover_art_181595312.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Khoninto-engihluphayo--FraternalTG.mp3","duration":"272","no_plays":18,"actor":null},{"id":8575,"track_name":"WINNER","label":"JAYSILVER","genre":"African","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1661811849_cover_art_29584771.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/WINNER-JAYSILVER.mp3","duration":"210","no_plays":19,"actor":null},{"id":8574,"track_name":"Fall Down","label":"StarKlair IBornnyGh","genre":"R&B","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1598855530_cover_art_144070369.png","audio":"https:\/\/nextxtar.com\/assets\/music\/Fall-Down-StarKlair-IBornnyGh.mp3","duration":"104","no_plays":24,"actor":null},{"id":8572,"track_name":"Future (Xhosa GAARA) Feat. HOME BOYS EL","label":"Unclee Manando","genre":"Hip-Hop","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1692436576_cover_art_913523741.png","audio":"https:\/\/nextxtar.com\/assets\/music\/Future-(Xhosa-GAARA)-Feat.-HOME-BOYS-EL-Unclee-Manando-.mp3","duration":"149","no_plays":10,"actor":null},{"id":8571,"track_name":"Khon'into engihluphayo","label":"FraternalTG","genre":"African","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1642682690_cover_art_181595312.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Khoninto-engihluphayo--FraternalTG.mp3","duration":"272","no_plays":27,"actor":null},{"id":8570,"track_name":"WINNER","label":"JAYSILVER","genre":"African","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1661811849_cover_art_29584771.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/WINNER-JAYSILVER.mp3","duration":"210","no_plays":29,"actor":null},{"id":8569,"track_name":"Fall Down","label":"StarKlair IBornnyGh","genre":"R&B","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1598855530_cover_art_144070369.png","audio":"https:\/\/nextxtar.com\/assets\/music\/Fall-Down-StarKlair-IBornnyGh.mp3","duration":"104","no_plays":26,"actor":null},{"id":8567,"track_name":"Dear X","label":"Rajoge music","genre":"World","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1693915823_cover_art_11078043.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Dear-X--Rajoge-music-.mp3","duration":"04:43","no_plays":6,"actor":""},{"id":8257,"track_name":"African poem","label":"MGBTHEKING","genre":"R&B","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1689588198_cover_art_414088412.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/African-poem-MGBTHEKING.mp3","duration":"231","no_plays":6,"actor":""},{"id":7636,"track_name":"Kabhi na Kabhi Rajveer Mehra ","label":"Rajveer Mehra","genre":"Instrumental (Does Not Contain Lyrics)","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1692521131_cover_art_317969536.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Kabhi-na-Kabhi-Rajveer-Mehra--Rajveer-Mehra.mp3","duration":"188","no_plays":5,"actor":""},{"id":7626,"track_name":"Future (Xhosa GAARA) Feat. HOME BOYS EL","label":"Unclee Manando ","genre":"Hip-Hop","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1692436576_cover_art_913523741.png","audio":"https:\/\/nextxtar.com\/assets\/music\/Future-(Xhosa-GAARA)-Feat.-HOME-BOYS-EL-Unclee-Manando-.mp3","duration":"149","no_plays":4,"actor":""},{"id":6118,"track_name":"Forgotten ft 1999","label":"Davo Aku","genre":"Gospel","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1662394022_cover_art_943847884.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Forgotten-ft-1999-Davo-Aku.mp3","duration":"214","no_plays":110,"actor":""},{"id":457,"track_name":"Something similar","label":"JerryBi","genre":"Jazz","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/1606803596_cover_art_858300016.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Something-similar-JerryBi.mp3","duration":"166","no_plays":11,"actor":""},{"id":5908,"track_name":"You Are God Ft Boluwaduro, obuz zalee","label":"Jude Osemudiamen","genre":"Gospel","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1660661204_cover_art_553182892.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/You-Are-God-Ft-Boluwaduro,-obuz-zalee-Jude-Osemudiamen.mp3","duration":"04:04","no_plays":9,"actor":""},{"id":5665,"track_name":"Gitmezsem","label":"Krone","genre":"Hip-Hop","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1659058799_cover_art_179979482.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Gitmezsem-Krone.mp3","duration":"02:11","no_plays":17,"actor":""},{"id":5511,"track_name":"Tomar Jonnoo Mon","label":"Dss music","genre":"Folk","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1657712493_cover_art_353341384.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Tomar-Jonnoo-Mon-Dss-music.mp3","duration":"06:30","no_plays":23,"actor":""},{"id":4521,"track_name":"BaNoNo","label":"Sire","genre":"Pop","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1647612215_cover_art_990754758.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/BaNoNo-Sire.mp3","duration":"217","no_plays":117,"actor":""},{"id":4076,"track_name":"Khon'into engihluphayo ","label":"FraternalTG","genre":"African","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1642682690_cover_art_181595312.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Khoninto-engihluphayo--FraternalTG.mp3","duration":"272","no_plays":5,"actor":""},{"id":3436,"track_name":"Off to the beach Usurper ft Flxshbaxk Rsa","label":"Flxshbaxk Rsa","genre":"Hip-Hop","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/1634885342_cover_art_235872792.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Off-to-the-beach-Usurper-ft-Flxshbaxk-Rsa--Flxshbaxk-Rsa.mp3","duration":"03:28","no_plays":7,"actor":""},{"id":3228,"track_name":"I Am The King","label":"The Buisness","genre":"Hip-Hop","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1640932659_cover_art_33745499.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/I-Am-The-King-The-Buisness.mp3","duration":"232","no_plays":19,"actor":""},{"id":2366,"track_name":"Yak dalei","label":"Tangkhul Laasak","genre":"Classical","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/1632291782_cover_art_457904860.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Yak-dalei-Tangkhul-Laasak.mp3","duration":"214","no_plays":3,"actor":""},{"id":2362,"track_name":"Rompe La Cama","label":"Mjunior","genre":"Hip-Hop","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1625839673_cover_art_727195813.png","audio":"https:\/\/nextxtar.com\/assets\/music\/Rompe-La-Cama-Mjunior.mp3","duration":"03:36","no_plays":113,"actor":""},{"id":2212,"track_name":"Kazing lemmet Yursari Ngalung","label":"Tangkhul Laasak","genre":"World","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/1632202223_cover_art_108608704.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Kazing-lemmet-Yursari-Ngalung-Tangkhul-Laasak.mp3","duration":"237","no_plays":6,"actor":""},{"id":1574,"track_name":"All Black Tonight Feat Juneux ","label":"Dc 702 ","genre":"Hip-Hop","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1626729114_cover_art_194281317.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/All-Black-Tonight-Feat-Juneux--Dc-702-.mp3","duration":"175","no_plays":1,"actor":""},{"id":779,"track_name":"Fall Down","label":"StarKlair IBornnyGh","genre":"R&B","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1598855530_cover_art_144070369.png","audio":"https:\/\/nextxtar.com\/assets\/music\/Fall-Down-StarKlair-IBornnyGh.mp3","duration":"104","no_plays":23,"actor":""},{"id":769,"track_name":"Fall Down","label":"StarKlair IBornnyGh","genre":"R&B","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1598855530_cover_art_144070369.png","audio":"https:\/\/nextxtar.com\/assets\/music\/Fall-Down-StarKlair-IBornnyGh.mp3","duration":"104","no_plays":22,"actor":""},{"id":554,"track_name":"Taking away","label":"JerryBi","genre":"Blues","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/1608183023_cover_art_966376306.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Taking-away-JerryBi.mp3","duration":"185","no_plays":27,"actor":""},{"id":8568,"track_name":"Dear X","label":"Rajoge music","genre":"World","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1693915823_cover_art_11078043.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Dear-X--Rajoge-music-.mp3","duration":"04:43","no_plays":8569,"actor":null},{"id":8573,"track_name":"Dear X","label":"Rajoge music","genre":"World","image":"https:\/\/nextxtar.com\/assets\/images\/CoverArt\/Thumb\/1693915823_cover_art_11078043.jpg","audio":"https:\/\/nextxtar.com\/assets\/music\/Dear-X--Rajoge-music-.mp3","duration":"04:43","no_plays":8568,"actor":null}]);



export const trackService = {

  async toggleLike(trackId: string): Promise<boolean> {
    //  const res = await fetch(`${API_URL}?path=like`, {
    console.log( "remeber to correct this");
    return true;
  },
 
async  getAllTracks(): Promise<Track[]> {

  console.log("------------------->>>",API_URL);

   // const res = await fetch(API_URL as string, { next: { revalidate: 3600 } });
  
//const resjson :Promise<Track[]> = res.json();
return backTrack;
   // return convertToTracks(await res.json());

  },
  
 async  getTrackById(targetId: any): Promise<Track> {


 
    // Convert targetId to number if it's a string
    const numericId = typeof targetId === 'string' ? parseInt(targetId, 10) : targetId;
    
    // Return the first track that matches the ID
    return backTrack.find(track => track.id === numericId);
  
  },
  
 async  updatePlayCount(id: number):  Promise<boolean> {
    //  const res = await fetch(`${API_URL}?path=play`, {
  console.log( "remeber to correct this");
  
  
  return true;
  }
  
};

// Sample data for development
export const sampleTracks: Track[] = [
  {
    id: 1,
    track_name: "Summer Vibes",
    label: "Singnify Records",
    genre: "Pop",
    image: "/images/summer-vibes.jpg",
    audio: "/audio/summer-vibes.mp3",
    duration: "3:45",
    no_plays: 1500,
    actor: "John Doe",
    artist: {
      id:9485485,
      name: "John Doe",
      picture: "/images/john-doe.jpg",
      info : "Multi-platinum artist from Los Angeles"
    },
    plays: 1500,
    releaseDate: "2023-06-21",
    isLiked: false
  },
  {
    id: 2,
    track_name: "Night Drive",
    label: "Moonlight Music",
    genre: "Electronic",
    image: "/images/night-drive.jpg",
    audio: "/audio/night-drive.mp3",
    duration: "4:20",
    no_plays: 2200,
    actor: "Sarah Smith",
    artist: {
      id:474644,
      name: "Sarah Smith",
      picture: "/images/sarah-smith.jpg",
      info: "Electronic music producer and DJ"
    },
    plays: 2200,
    releaseDate: "2023-07-15",
    isLiked: true
  },

  {
    id: 1,
    track_name: "Summer Vibes",
    label: "Singnify Records",
    genre: "Pop",
    image: "/images/summer-vibes.jpg",
    audio: "/audio/summer-vibes.mp3",
    duration: "3:45",
    no_plays: 1500,
    actor: "John Doe",
    artist: {
      id:9485485,
      name: "John Doe",
      picture: "/images/john-doe.jpg",
      info : "Multi-platinum artist from Los Angeles"
    },
    plays: 1500,
    releaseDate: "2023-06-21",
    isLiked: false
  },
  {
    id: 2,
    track_name: "Night Drive",
    label: "Moonlight Music",
    genre: "Electronic",
    image: "/images/night-drive.jpg",
    audio: "/audio/night-drive.mp3",
    duration: "4:20",
    no_plays: 2200,
    actor: "Sarah Smith",
    artist: {
      id:474644,
      name: "Sarah Smith",
      picture: "/images/sarah-smith.jpg",
      info: "Electronic music producer and DJ"
    },
    plays: 2200,
    releaseDate: "2023-07-15",
    isLiked: true
  }, {
    id: 1,
    track_name: "Summer Vibes",
    label: "Singnify Records",
    genre: "Pop",
    image: "/images/summer-vibes.jpg",
    audio: "/audio/summer-vibes.mp3",
    duration: "3:45",
    no_plays: 1500,
    actor: "John Doe",
    artist: {
      id:9485485,
      name: "John Doe",
      picture: "/images/john-doe.jpg",
      info : "Multi-platinum artist from Los Angeles"
    },
    plays: 1500,
    releaseDate: "2023-06-21",
    isLiked: false
  },
  {
    id: 2,
    track_name: "Night Drive",
    label: "Moonlight Music",
    genre: "Electronic",
    image: "/images/night-drive.jpg",
    audio: "/audio/night-drive.mp3",
    duration: "4:20",
    no_plays: 2200,
    actor: "Sarah Smith",
    artist: {
      id:474644,
      name: "Sarah Smith",
      picture: "/images/sarah-smith.jpg",
      info: "Electronic music producer and DJ"
    },
    plays: 2200,
    releaseDate: "2023-07-15",
    isLiked: true
  }, {
    id: 1,
    track_name: "Summer Vibes",
    label: "Singnify Records",
    genre: "Pop",
    image: "/images/summer-vibes.jpg",
    audio: "/audio/summer-vibes.mp3",
    duration: "3:45",
    no_plays: 1500,
    actor: "John Doe",
    artist: {
      id:9485485,
      name: "John Doe",
      picture: "/images/john-doe.jpg",
      info : "Multi-platinum artist from Los Angeles"
    },
    plays: 1500,
    releaseDate: "2023-06-21",
    isLiked: false
  },
  {
    id: 2,
    track_name: "Night Drive",
    label: "Moonlight Music",
    genre: "Electronic",
    image: "/images/night-drive.jpg",
    audio: "/audio/night-drive.mp3",
    duration: "4:20",
    no_plays: 2200,
    actor: "Sarah Smith",
    artist: {
      id:474644,
      name: "Sarah Smith",
      picture: "/images/sarah-smith.jpg",
      info: "Electronic music producer and DJ"
    },
    plays: 2200,
    releaseDate: "2023-07-15",
    isLiked: true
  },
  // Add 6 more sample tracks...
];


export interface xxHeroSlide {
    id: string;
    title: string;
    artist: string;
    image: string;
    type: 'song' | 'album' | 'artist';
    plays: number;
    duration: string;
    releaseDate: string;
    track?: Track;

  }
  

  

  export const heroSlides: HeroSlide[] = [
    {
      id: '1',
      title: 'Midnight Dreams',
      artist: 'Luna Eclipse',
      image: '/images/hero/midnight-dreams.jpg',
      type: 'song',
      plays: 1500000,
      duration: '3:45',
      shuffle: true, 
      repeat :'all', 
      queue:[], 
      currentIndex: 1,

      releaseDate: '2024-01-15'   ,
        track:{
        track_name:"People", 
        genre:'Rock', 
        label:'SIIII', 
        audio:'https://a51.1tv.ng/src/cdn/Uncle%20Spice/People-Uncle-Spice%20(1).mp3',
        url:'https://a51.1tv.ng/src/cdn/Uncle%20Spice/People-Uncle-Spice%20(1).mp3',
        isLiked:true,
        id:477474, 
        duration:'342',
        releaseDate:'2024-01-01',
         image:'https://a51.1tv.ng/src/cdn/Uncle%20Spice/Uncle%20Spice.jpg',

          plays:4673, 
artist:{ 
  id:46464,
  name:'Uncle Spice',
  monthlyListeners:564,


          },

      },
    },
    {
      id: '2',
      title: 'Not Done with Me',
      artist: 'Emi Moto',
      image: '/images/hero/not-done-with-me.jpg',
      type: 'song',
      plays: 1500000,
      duration: '3:45',
      shuffle: true, 
      repeat :'all', 
      queue:[], 
      currentIndex: 1,

      releaseDate: '2024-01-15'   ,
        track:{
        track_name:"People", 
        genre:'Rock', 
        label:'SIIII', 
        audio:'https://a51.1tv.ng/src/cdn/Uncle%20Spice/People-Uncle-Spice%20(1).mp3',
        url:'https://a51.1tv.ng/src/cdn/Uncle%20Spice/People-Uncle-Spice%20(1).mp3',
        isLiked:true,
        id:477474, 
        duration:'342',
        releaseDate:'2024-01-01',
         image:'https://a51.1tv.ng/src/cdn/Uncle%20Spice/Uncle%20Spice.jpg',

          plays:4673, 
artist:{ 
  id:46464,
  name:'Uncle Spice',
  monthlyListeners:564,


          },

      },
    },
    {
      id: '3',
      title: 'I wrote it Down',
      artist: 'Pammy Emi',
      image: '/images/hero/wrote-down.jpg',
      type: 'song',
      plays: 1500000,
      duration: '3:45',
      shuffle: true, 
      repeat :'all', 
      queue:[], 
      currentIndex: 1,

      releaseDate: '2024-01-15'   ,
        track:{
        track_name:"People", 
        genre:'Rock', 
        label:'SIIII', 
        audio:'https://a51.1tv.ng/src/cdn/Uncle%20Spice/People-Uncle-Spice%20(1).mp3',
        url:'https://a51.1tv.ng/src/cdn/Uncle%20Spice/People-Uncle-Spice%20(1).mp3',
        isLiked:true,
        id:477474, 
        duration:'342',
        releaseDate:'2024-01-01',
         image:'https://a51.1tv.ng/src/cdn/Uncle%20Spice/Uncle%20Spice.jpg',

          plays:4673, 
artist:{ 
  id:46464,
  name:'Uncle Spice',
  monthlyListeners:564,


          },

      },
    },
    // Add more hero slides...
  ];
  
  export const hotArtists: Artist[] = [
    {
      id: '1',
      name: 'Pammy emi',
      image: '/images/artists/luna-eclipse.jpg',
      genre: 'Pop/Electronic',
      followers: 4736739,
      monthlyListeners: 523441,
      topSong: 'Midnight Dreams',
 
    },

    {
      id: '2',
      name: 'Manny Studio',
      image: '/images/artists/manny-studio.jpg',
      genre: 'Pop/Electronic',
      followers: 243000,
      monthlyListeners: 43334,
      topSong: 'Dream Big',
 
    },

    {
      id: '3',
      name: 'Pammy emi',
      image: '/images/artists/pammy-emi.jpg',
      genre: 'Pop/Electronic',
      followers: 2210,
      monthlyListeners: 4340232,
      topSong: 'Majest Lord',
 
    }, {
      id: '1',
      name: 'Pammy emi',
      image: '/images/artists/luna-eclipse.jpg',
      genre: 'Pop/Electronic',
      followers: 4736739,
      monthlyListeners: 523441,
      topSong: 'Midnight Dreams',
 
    },

    {
      id: '2',
      name: 'Manny Studio',
      image: '/images/artists/manny-studio.jpg',
      genre: 'Pop/Electronic',
      followers: 243000,
      monthlyListeners: 43334,
      topSong: 'Dream Big',
 
    },

    {
      id: '3',
      name: 'Pammy emi',
      image: '/images/artists/pammy-emi.jpg',
      genre: 'Pop/Electronic',
      followers: 2210,
      monthlyListeners: 4340232,
      topSong: 'Majest Lord',
 
    }, {
      id: '1',
      name: 'Pammy emi',
      image: '/images/artists/luna-eclipse.jpg',
      genre: 'Pop/Electronic',
      followers: 4736739,
      monthlyListeners: 523441,
      topSong: 'Midnight Dreams',
 
    },

    {
      id: '2',
      name: 'Manny Studio',
      image: '/images/artists/manny-studio.jpg',
      genre: 'Pop/Electronic',
      followers: 243000,
      monthlyListeners: 43334,
      topSong: 'Dream Big',
 
    },

    {
      id: '3',
      name: 'Pammy emi',
      image: '/images/artists/pammy-emi.jpg',
      genre: 'Pop/Electronic',
      followers: 2210,
      monthlyListeners: 4340232,
      topSong: 'Majest Lord',
 
    },

    // Add more artists...
  ];
  
  export const xnewsStream: NewsItem[] = [
    {
      id: '1',
      title: 'Luna Eclipse Announces World Tour',
      image: '/images/news/luna-tour.jpg',
      type: 'event',
      date: '2024-02-01',
      link: '/news/luna-eclipse-tour'
    },

    {
      id: '2',
      title: 'Luna Eclipse Announces World Tour',
      image: '/images/news/luna-tour.jpg',
      type: 'event',
      date: '2024-02-01',
      link: '/news/luna-eclipse-tour'
    },
    {
      id: '3',
      title: 'Luna Eclipse Announces World Tour',
      image: '/images/news/luna-tour.jpg',
      type: 'event',
      date: '2024-02-01',
      link: '/news/luna-eclipse-tour'
    },
    // Add more news items...
  ];

  export const newsItem: NewsItem[] = [
    {
      id: '1',
      title: 'Luna Eclipse Announces World Tour',
      image: '/images/news/luna-tour.jpg',
      type: 'event',
      date: '2024-02-01',
      link: '/news/luna-eclipse-tour'
    },

    {
      id: '2',
      title: 'Luna Eclipse Announces World Tour',
      image: '/images/news/luna-tour.jpg',
      type: 'event',
      date: '2024-02-01',
      link: '/news/luna-eclipse-tour'
    },
    {
      id: '3',
      title: 'Luna Eclipse Announces World Tour',
      image: '/images/news/luna-tour.jpg',
      type: 'event',
      date: '2024-02-01',
      link: '/news/luna-eclipse-tour'
    },
    // Add more news items...
  ];


  export const newsStream: NewsItem[] = [
    {
      id: '1',
      title: 'Luna Eclipse Announces World Tour',
      image: '/images/news/luna-tour.jpg',
      type: 'event',
      date: '2024-02-01',
      link: '/news/luna-eclipse-tour'
    },
    {
      id: '2',
      title: 'Midnight Horizon Drops Surprise Album',
      image: '/images/news/midnight-album.webp',
      type: 'release',
      date: '2024-02-15',
      link: '/news/midnight-horizon-album'
    },
    {
      id: '3',
      title: 'Interview: Behind the Scenes with Sonic Wave',
      image: '/images/news/sonic-interview.jpg',
      type: 'interview',
      date: '2024-01-28',
      link: '/news/sonic-wave-interview'
    },
    {
      id: '4',
      title: 'Electronic Music Festival Lineup Revealed',
      image: '/images/news/festival-lineup.jpg',
      type: 'event',
      date: '2024-03-10',
      link: '/news/electronic-festival'
    },
    {
      id: '5',
      title: 'Astral Beats Wins Grammy for Best New Artist',
      image: '/images/news/astral-grammy.jpg',
      type: 'news',
      date: '2024-02-06',
      link: '/news/astral-beats-grammy'
    },
    {
      id: '6',
      title: 'Vinyl Revival: Classic Albums Getting Remastered',
      image: '/images/news/vinyl-revival.jpg',
      type: 'release',
      date: '2024-02-20',
      link: '/news/vinyl-remaster'
    },
    {
      id: '7',
      title: 'Summer Session: Open Air Concert Series Announced',
      image: '/images/news/summer-sessions.jpg',
      type: 'event',
      date: '2024-04-01',
      link: '/news/summer-sessions'
    },
    {
      id: '8',
      title: 'Echo Chamber Releases New Music Video',
      image: '/images/news/echo-video.jpg',
      type: 'release',
      date: '2024-02-12',
      link: '/news/echo-chamber-video'
    },
    {
      id: '9',
      title: 'Exclusive: Crystal Harmony Talks About Musical Journey',
      image: '/images/news/crystal-harmony.jpg',
      type: 'interview',
      date: '2024-01-30',
      link: '/news/crystal-harmony-journey'
    },
    {
      id: '10',
      title: 'Music Industry Report: Streaming Trends 2024',
      image: '/images/news/streaming-trends.jpg',
      type: 'news',
      date: '2024-02-22',
      link: '/news/streaming-report'
    },
    {
      id: '11',
      title: 'Neon Pulse Collective Announces Collaboration Album',
      image: '/images/news/neon-collab.jpg',
      type: 'release',
      date: '2024-03-05',
      link: '/news/neon-pulse-collab'
    },
    {
      id: '12',
      title: 'Underground Beats: New Club Venue Opening',
      image: '/images/news/club-opening.jpg',
      type: 'event',
      date: '2024-03-15',
      link: '/news/underground-venue'
    },
    {
      id: '13',
      title: 'Retro Revival: 80s Synth Making a Comeback',
      image: '/images/news/retro-synth.jpg',
      type: 'news',
      date: '2024-02-08',
      link: '/news/retro-revival'
    },
    {
      id: '14',
      title: 'Producer Spotlight: Behind the Mix with DJ Starfield',
      image: '/images/news/dj-starfield.jpg',
      type: 'interview',
      date: '2024-02-18',
      link: '/news/dj-starfield-spotlight'
    },
    {
      id: '15',
      title: 'Music Tech: New AI-Powered Production Tools Released',
      image: '/images/news/music-tech.jpg',
      type: 'news',
      date: '2024-03-01',
      link: '/news/ai-music-tools'
    }
  ];
  
  // You could also export a function to get filtered news
  export const getNewsByType = (type: NewsItem['type']) => {
    return newsStream.filter(item => item.type === type);
  };
  
  // Get most recent news items
  export const getRecentNews = (count: number = 5) => {
    return [...newsStream]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  };