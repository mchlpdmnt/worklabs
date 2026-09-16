import { Geist } from "next/font/google";
import { BlogCard } from "@registry/blog-card/blog-card";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const posts = [
  {
    imageUrl: "https://picsum.photos/id/1015/800/1200",
    imageAlt: "Fjord under a bright sky",
    title: "Chasing the Northern Lights",
    readingTime: "6 min read",
    datePublished: "Jul 18, 2026",
    excerpt:
      "A field guide to catching the aurora over the Lofoten islands — when to go, where to stand, and what the sky won't tell you.",
  },
  {
    imageUrl: "https://picsum.photos/id/1016/800/1200",
    imageAlt: "Desert dunes at golden hour",
    title: "The Quiet of the Dunes",
    readingTime: "4 min read",
    datePublished: "Jun 30, 2026",
    excerpt:
      "Two weeks in the Sahara taught me more about silence than any monastery could. Here's what the sand keeps.",
  },
  {
    imageUrl: "https://picsum.photos/id/1018/800/1200",
    imageAlt: "Misty forest canopy",
    title: "Walking the Old-Growth",
    readingTime: "8 min read",
    datePublished: "Jun 12, 2026",
    excerpt:
      "Trees older than most nations line a single-track trail in the Pacific Northwest. A slow essay on slow forests.",
  },
];

export default function BlogCardDemo() {
  return (
    <div className={`${geistSans.className} min-h-screen font-sans`}>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-10 px-6 py-16">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            BlogCard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            registry/blog-card — hover a card (or tap it on mobile): the
            details lift, the image zooms, and the reading time and Read button
            slide in.
          </p>
        </header>

        <div className="grid w-full grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <BlogCard
              key={post.title}
              className={index > 0 ? "hidden sm:block" : undefined}
              {...post}
              onRead={() => window.alert(`Read: ${post.title}`)}
            />
          ))}
        </div>

      </main>
    </div>
  );
}
