// app/about/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Play, 
  Apple,
  Mail,
  Globe,
  Users,
  Music,
  Award,
  Radio
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-indigo-900/70 to-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/api/placeholder/1920/1080')" }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              We&apos;re<br />Singnify
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
              Changing the way music is distributed, licensed, and published worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Singnify is changing the music industry
            </h2>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto">
              Through established partner collaborations with Sony Music, Amazon, Orchard, 
              51 Lex Records, iTunes, Spotify, Tidal, and Pandora.
            </p>
          </div>

          <div className="mb-12">
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden">
              <Image
                src="https://singnify.com/assets/img/singnifylogolg.png"
                alt="Singnify Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">
              Singnify is the brainchild of creativity geniuses, Qris Chinedu Ebeatu and Mr. Digger Elias. 
              Mr. Elias has a solid history as a music master technocrat with experience working with various 
              companies that pioneered the digital music distribution. Qris Chinedu Ebeatu has worked alongside 
              Mr. Elias for over 15 years in the areas of content development and music transformation within 
              the African regions.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h3>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  &ldquo;Music is our passion. That&apos;s why we founded Singnify; to take digital music 
                  distribution to every corner of the globe, especially Africa. We understand that it&apos;s 
                  challenging for talented Africans to distribute their songs digitally. Singnify plans to 
                  step into that gap and make it possible for talent from Africa and other typically 
                  disenfranchised communities to distribute their music worldwide via a smartphone and 
                  or other digital connection,&rdquo; explains Qris Chinedu Ebeatu, Co-Founder/CEO of 
                  online music distribution platform Singnify.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="https://singnify.com/assets/img/homelg.png"
                alt="Singnify Platform"
                width={600}
                height={400}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* Inclusivity Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="https://singnify.com/assets/img/about1.jpg"
                  alt="Music Diversity"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">For All Genres</h3>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  &ldquo;The music industry has changed rapidly in recent decades, moving from Vinyl to 
                  cassettes and CDs, to digital distribution. Singnify aims to play a pivotal role in 
                  this continuing revolution, offering underground, unknown, and up-and-coming artists 
                  an innovative, accessible platform for distributing, licensing, and publishing their 
                  songs and videos. In the spirit of inclusivity, we welcome all genres of music releases 
                  from Christian to folk, highlife, Jazz, hip-hop, soul, blues, and traditional or world 
                  music,&rdquo; continues Qris Chinedu Ebeatu.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  &ldquo;Independent artists can upload their songs and videos from the comfort of their 
                  home or studio while we do the heavy lifting, promoting them in over 500 music stores 
                  and via popular online streaming platforms.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Comprehensive Services</h3>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  Singnify also caters to music executives, record labels, marketers, movie producers, 
                  and more who wish to upload their artists&apos; latest releases.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  &ldquo;We even go so far as to sign artists we believe in. We have a team of dedicated 
                  professionals who specialise in strategies planning, marketing, branding, public 
                  relations, and more. And work closely with music executives and record labels looking 
                  for promising artists to sign.&rdquo;
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="https://singnify.com/assets/img/about2.jpg"
                alt="Music Services"
                width={600}
                height={400}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* App Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="https://singnify.com/assets/img/about3.png"
                alt="Singnify App"
                width={500}
                height={500}
                className="w-full h-auto rounded-2xl"
              />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Mobile App & Radio</h3>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  Singnify&apos;s monthly challenges and top chart songs category are further designed 
                  to give artists an opportunity to compete for fabulous prizes, attract more fans, and 
                  judge how people like an artist&apos;s song or video offering.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  &ldquo;What&apos;s more, we have a dedicated virtual radio that followers can use to 
                  listen to the music uploaded by our represented artists. Plus, our Singnify App is 
                  available from the Google Play and Apple Play stores for Android and iOS devices, so 
                  download it today to access our platform and some of the best songs and videos from 
                  underground, unknown, and up-and-coming artists across the globe,&rdquo; concludes 
                  Qris Chinedu Ebeatu.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-6">
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Google Play
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center">
                  <Apple className="w-5 h-5 mr-2" />
                  App Store
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Conclusion</h2>
            <div className="prose prose-lg prose-invert max-w-4xl mx-auto">
              <p className="text-gray-300 leading-relaxed">
                Singnify is the brainchild of creativity geniuses, Qris Chinedu Ebeatu and Mr. Digger Elias. 
                Mr. Elias has a solid history as a music master technocrat with experience working with various 
                companies that pioneered the digital music distribution. Qris has worked alongside Mr. Elias 
                for more than 15 years in the areas of content development and music transformation within the 
                African regions. Singnify is changing the way music is distributed, licensed, and published 
                worldwide through its established partner collaborations with Sony Music, Amazon, Orchard, 
                51 Lex Records, iTunes, Spotify, Tidal, and Pandora.
              </p>
            </div>
          </div>
        </section>

        {/* Social Media & Contact */}
        <section className="mb-20">
          <div className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Connect With Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Social Media</h3>
                <div className="space-y-2">
                  <a href="https://web.facebook.com/singnifymusic/" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-white">
                    <Facebook className="w-5 h-5 mr-3" />
                    https://web.facebook.com/singnifymusic/
                  </a>
                  <a href="https://twitter.com/Singnify" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-white">
                    <Twitter className="w-5 h-5 mr-3" />
                    https://twitter.com/Singnify
                  </a>
                  <a href="https://www.instagram.com/Singnify/" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-white">
                    <Instagram className="w-5 h-5 mr-3" />
                    https://www.instagram.com/Singnify/
                  </a>
                  <a href="https://www.youtube.com/channel/UChgNR3asChkPAYs0KKPMi3Q" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-white">
                    <Youtube className="w-5 h-5 mr-3" />
                    YouTube Channel
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-300">
                    <Mail className="w-5 h-5 mr-3" />
                    info@singnify.com
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Mail className="w-5 h-5 mr-3" />
                    support@singnify.com
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Mail className="w-5 h-5 mr-3" />
                    licensing@singnify.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Image
                  src="https://singnify.com/assets/img/icon-large.png"
                  alt="Singnify"
                  width={120}
                  height={40}
                />
              </div>
              <p className="text-gray-400 mb-4">
                Changing the way music is distributed worldwide
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/discover/artists" className="text-gray-400 hover:text-white">Artists</Link></li>
                <li><Link href="/discover/charts" className="text-gray-400 hover:text-white">Top Charts</Link></li>
                <li><Link href="/discover/genres" className="text-gray-400 hover:text-white">Genres</Link></li>
                <li><Link href="/press" className="text-gray-400 hover:text-white">Press</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Your Account</h4>
              <ul className="space-y-2">
                <li><Link href="/profile" className="text-gray-400 hover:text-white">Profile</Link></li>
                <li><Link href="/albums" className="text-gray-400 hover:text-white">Albums</Link></li>
                <li><Link href="/tracks" className="text-gray-400 hover:text-white">Tracks</Link></li>
                <li><Link href="/playlists" className="text-gray-400 hover:text-white">Playlists</Link></li>
                <li><Link href="/liked" className="text-gray-400 hover:text-white">Liked</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Help & Support</h4>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/licensing" className="text-gray-400 hover:text-white">Licensing Agreement</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 Singnify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}