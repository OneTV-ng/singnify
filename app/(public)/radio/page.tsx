import ClientRadioControls from "./ClientRadioControls";

export const metadata = {
  title: "SingCAST — Singnify Radio | Sweet Music to the World",
  description:
    "SingCAST — a global internet radio by Singnify. Sweet music to the world. A Global Music / Media Distribution and Promotion Portal — singnify.com",
  openGraph: {
    title: "SingCAST — Singnify Radio",
    description:
      "Listen live to SingCAST — Sweet Music to the World. Stream: https://radio.imediaport.com/singcast",
    url: "https://singnify.com/radio",
    siteName: "Singnify",
  },
  twitter: {
    card: "summary_large_image",
    title: "SingCAST — Singnify Radio",
    description:
      "Listen live to SingCAST — Sweet Music to the World. A Global Music / Media Distribution and Promotion Portal.",
  },
};

const STREAM_URL = "https://radio.imediaport.com/singcast"; // Icecast MP3 stream
const DEFAULT_COVER = "/radio.png"; // default cover image in /public

export default function RadioPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8 text-gray-300">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-teal-400">SingCAST</h1>
            <p className="text-sm text-gray-400">
              Singnify Radio — Sweet music to the world
            </p>
          </div>
        </header>

        {/* Player Section */}
        <section className="flex flex-col md:flex-row gap-6">
          {/* Cover */}
          <div className="relative w-full md:w-56 h-56 md:h-56 flex-shrink-0 rounded-lg overflow-hidden shadow-inner">
            <img
              src={DEFAULT_COVER}
              alt="SingCAST cover"
              className="w-full h-full object-cover filter contrast-105 saturate-105"
            />
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-400 to-yellow-400 text-white font-bold text-xs px-3 py-1 rounded-full">
              LIVE
            </div>
          </div>

          {/* Metadata & Controls */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div>
              <strong id="track-title" className="block text-lg text-teal-400">
                SingCAST — Live DJ
              </strong>
              <span id="track-sub" className="block text-sm text-gray-400">
                Singnify Radio • Global Stream
              </span>
            </div>

            <ClientRadioControls streamUrl={STREAM_URL} />

            <div className="flex gap-3 items-center mt-4">
              <a
                href="https://singnify.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-gray-400 hover:text-teal-400"
              >
                singnify.com
              </a>
              <a
                href={STREAM_URL}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 text-sm rounded-lg border border-gray-600 hover:border-teal-400"
              >
                Open stream
              </a>
            </div>
          </div>
        </section>

        {/* About Box */}
        <aside className="mt-6 p-4 border border-dashed border-gray-600 rounded-lg text-gray-400">
          <h3 className="font-semibold text-gray-200 mb-1">About SingCAST</h3>
          <p className="text-sm">
            SingCAST by Singnify is a global internet radio for emerging and classic
            artists — music, features, promos and more. Stream is Icecast/.mp3
            compatible.
          </p>
        </aside>
      </div>
    </main>
  );
}
