import React from 'react'

function Footer() {
  return (
    <footer className="w-full text-white pt-20 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.4)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-20 pb-20">
        <div>
          <h3 className="text-lg font-semibold mb-2">Docs</h3>
          <ul className="space-y-1 text-sm text-neutral-400">
            <li><a href="#">Libraries</a></li>
            <li><a href="#">Frameworks</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Community</h3>
          <ul className="space-y-1 text-sm text-neutral-400">
            <li><a href="#">Join Discord</a></li>
            <li><a href="#">Follow on X</a></li>
            <li><a href="#">Star us on GitHub</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Contribute</h3>
          <ul className="space-y-1 text-sm text-neutral-400">
            <li><a href="#">Write Docs</a></li>
            <li><a href="#">Open an Issue</a></li>
            <li><a href="#">GitHub Repository</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">More</h3>
          <ul className="space-y-1 text-sm text-neutral-400">
            <li><a href="#">Changelog</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">License</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer