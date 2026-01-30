import HorizontalScroll from "@/app/components/uix/HorizontalScroll";
import MusicCard01, { Artist } from "@/app/components/uix/MusicCard01";

const hotArtists: Artist[] = [
  { id: 1, name: "Taylor Swift", image: "/api/placeholder/100/100", monthlyListeners: 83500000 },
  { id: 2, name: "The Weeknd", image: "/api/placeholder/100/100", monthlyListeners: 75200000 },
  { id: 3, name: "Drake", image: "/api/placeholder/100/100", monthlyListeners: 68400000 },
  { id: 4, name: "Bad Bunny", image: "/api/placeholder/100/100", monthlyListeners: 59700000 },
  { id: 5, name: "Billie Eilish", image: "/api/placeholder/100/100", monthlyListeners: 56300000 },
  { id: 6, name: "Ariana Grande", image: "/api/placeholder/100/100", monthlyListeners: 51900000 },
  { id: 7, name: "Ed Sheeran", image: "/api/placeholder/100/100", monthlyListeners: 48200000 },
  { id: 8, name: "Dua Lipa", image: "/api/placeholder/100/100", monthlyListeners: 43600000 },
];

const ExampleWithArtists = () => (
  <HorizontalScroll title="Trending Artists">
    {hotArtists.map((artist) => (
      <MusicCard01 key={artist.id} artist={artist} />
    ))}
  </HorizontalScroll>
);

const ExampleUsage = () => {
  const items = [
    { id: 1, name: "Item 1", color: "bg-blue-500" },
    { id: 2, name: "Item 2", color: "bg-red-500" },
    { id: 3, name: "Item 3", color: "bg-green-500" },
    { id: 4, name: "Item 4", color: "bg-purple-500" },
    { id: 5, name: "Item 5", color: "bg-yellow-500" },
    { id: 6, name: "Item 6", color: "bg-pink-500" },
    { id: 7, name: "Item 7", color: "bg-indigo-500" },
    { id: 8, name: "Item 8", color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-12 p-4">
      <ExampleWithArtists />
      <HorizontalScroll title="Example Items">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex-shrink-0 w-48 h-48 ${item.color} rounded-lg flex items-center justify-center text-white font-bold`}
          >
            {item.name}
          </div>
        ))}
      </HorizontalScroll>
    </div>
  );
};

export default ExampleUsage;
