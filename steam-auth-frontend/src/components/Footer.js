import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 mt-12">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

    {/* Brand */}
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Pixel Mart</h2>
      <p className="text-sm">
        Your trusted marketplace for Steam and Valorant skins. Safe, fast, and gamer-approved.
      </p>
    </div>

    {/* Links */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Marketplace</h3>
      <ul className="space-y-2">
        <li><a href="#" className="hover:underline">Browse Skins</a></li>
        <li><a href="#" className="hover:underline">Sell Items</a></li>
        <li><a href="#" className="hover:underline">Pricing</a></li>
        <li><a href="#" className="hover:underline">FAQ</a></li>
      </ul>
    </div>

    {/* Community */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Community</h3>
      <ul className="space-y-2">
        <li><a href="#" className="hover:underline">Discord</a></li>
        <li><a href="#" className="hover:underline">Reddit</a></li>
        <li><a href="#" className="hover:underline">YouTube</a></li>
        <li><a href="#" className="hover:underline">Twitter</a></li>
      </ul>
    </div>

    {/* Legal & Contact */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
      <ul className="space-y-2">
        <li><a href="#" className="hover:underline">Contact Us</a></li>
        <li><a href="#" className="hover:underline">Privacy Policy</a></li>
        <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
      </ul>
    </div>
  </div>

  {/* Bottom Line */}
  <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} Pixel Mart. All rights reserved.
  </div>
</footer>

  )
}

export default Footer
