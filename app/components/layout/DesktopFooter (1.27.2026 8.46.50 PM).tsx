import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaAndroid,
  FaApple,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white px-6 py-12">
    <div className="text-center mb-8 md:ml-[120px]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Section 1 */}
        <div className="ml-8">
          <h4 className="text-teal-400 font-semibold mb-3">Explore</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-teal-300">Resources</a></li>
            <li><a href="#" className="hover:text-teal-300">Artists</a></li>
            <li><a href="#" className="hover:text-teal-300">Top Charts</a></li>
            <li><a href="#" className="hover:text-teal-300">Genres</a></li>
            <li><a href="#" className="hover:text-teal-300">Press</a></li>
            <li><a href="#" className="hover:text-teal-300">About Us</a></li>
          </ul>
        </div>

        {/* Section 2 */}
        <div>
          <h4 className="text-pink-400 font-semibold mb-3">Account</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-pink-300">Sign In</a></li>
            <li><a href="#" className="hover:text-pink-300">Sign Up</a></li>
            <li><a href="#" className="hover:text-pink-300">Your Singnify</a></li>
            <li><a href="#" className="hover:text-pink-300">Profile</a></li>
            <li><a href="#" className="hover:text-pink-300">Albums</a></li>
            <li><a href="#" className="hover:text-pink-300">Tracks</a></li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h4 className="text-purple-400 font-semibold mb-3">Library</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-purple-300">Playlist</a></li>
            <li><a href="#" className="hover:text-purple-300">Liked</a></li>
            <li><a href="#" className="hover:text-purple-300">Following</a></li>
            <li><a href="#" className="hover:text-purple-300">Help</a></li>
            <li><a href="#" className="hover:text-purple-300">FAQ</a></li>
            <li><a href="#" className="hover:text-purple-300">Support</a></li>
          </ul>
        </div>

        {/* Section 4 */}
        <div>
          <h4 className="text-yellow-400 font-semibold mb-3">Legal & Follow Us</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-yellow-300">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-yellow-300">Terms of Service</a></li>
            <li><a href="#" className="hover:text-yellow-300">Distribution, Publishing & Licensing</a></li>
          </ul>

          <div className="flex space-x-4 mt-4">
            <a href="#"><FaFacebookF className="hover:text-blue-500" /></a>
            <a href="#"><FaTwitter className="hover:text-sky-400" /></a>
            <a href="#"><FaInstagram className="hover:text-pink-500" /></a>
            <a href="#"><FaYoutube className="hover:text-red-500" /></a>
          </div>

          <div className="flex space-x-4 mt-4">
            <a href="#"><FaAndroid className="hover:text-green-400" size={24} /></a>
            <a href="#"><FaApple className="hover:text-white" size={24} /></a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-gray-400 mt-10 text-xs">
        &copy; 2026 Copyright. <span className="text-white font-semibold">Singnify</span>, All rights reserved.
      </div></div>
    </footer>
  );
};

export default Footer;
