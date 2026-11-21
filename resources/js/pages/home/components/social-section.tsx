const instagramPosts = [
  { image: "/images/social/CAB_social_1.webp", likes: "2.4k" },
  { image: "/images/social/CAB_social_2.webp", likes: "1.8k" },
  { image: "/images/social/CAB_social_3.webp", likes: "3.2k" },
  { image: "/images/social/CAB_social_4.webp", likes: "956" },
  { image: "/images/social/CAB_social_5.webp", likes: "1.5k" },
  { image: "/images/social/CAB_social_6.webp", likes: "2.1k" },
]

export function SocialSection() {
  return (
    <section id="creators" className="relative py-16 bg-[#003B7A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 text-center">
          <span className="inline-block font-mono text-4xl tracking-widest text-[#FFE200]">
            ACOMPANHE A CAB NO BRASIL
          </span>
          <h2 className="mt-2 overflow-hidden text-3xl font-black tracking-tighter text-white md:hidden">
            <span className="inline-block">@cab</span>
            <span className="inline-block text-[#319600]">.IN</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {instagramPosts.map((post, index) => (
            <div
              key={post.image}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
            >
              <img
                src={post.image}
                alt={`Instagram post ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 hidden items-center justify-center bg-[#319600]/0 opacity-0 transition-opacity duration-300 group-hover:bg-[#319600]/20 group-hover:opacity-100 md:flex">
                <div className="flex items-center gap-1 text-white">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="font-mono text-xs">{post.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="https://instagram.com/cambioautomaticodobrasil"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-[#319600] px-6 py-3 text-sm font-bold tracking-wide text-[#FFFFFF]"
          >
            <svg
              className="relative z-10 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span className="relative z-10">Siga @cambioautomaticodobrasil</span>
          </a>
        </div>
      </div>
    </section>
  )
}
