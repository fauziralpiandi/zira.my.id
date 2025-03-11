[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fauziralpiandi/zira.my.id)

## zira.my.id

My personal website built with:

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Content SDK:** [Contentlayer 2](https://github.com/timlrx/contentlayer2)
- **Database:** [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- **Analytics:** [Vercel Analytics](https://vercel.com/docs/analytics)
- **API Integration:** [Spotify API](https://developer.spotify.com/)
- **Deployment:** [Vercel](https://vercel.com/home)

## Features

- **High Performance (SSR, SSG, ISR)** — Optimized rendering for faster page loads and improved SEO.
- **Optimized Loading (Code Splitting & Lazy Loading)** — Loads only necessary components to enhance speed.
- **Efficient Data Handling (Caching & Optimization)** — Reduces redundant API calls and speeds up data retrieval.
- **Scalable Backend (Edge & Serverless Functions)** — Ensures fast, distributed, and scalable request handling.
- **Modern & Responsive UI (Mobile & Desktop)** — Fully adaptive design for all screen sizes.
- **Flexible Content Management (Markdown & MDX)** — Supports rich content creation with embedded components.
- **SEO & Accessibility Optimized** — Improves search engine rankings and enhances user accessibility.
- **Real-time Insights & Analytics** — Monitors traffic, user behavior, and performance metrics.
- **Seamless API Integrations** — Connects effortlessly with third-party services and APIs.
- **Structured & Scalable Storage** — Handles structured and unstructured data efficiently.

## Getting Started

1. Clone the repository and install dependencies

```sh
git clone https://github.com/fauziralpiandi/zira.my.id.git
cd zira.my.id
pnpm install
```

2. Configure environment variables

Create a `.env.local` file in the root directory and add the following variables:

```sh
DATABASE_URL=your_database_url
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
```

3. Start the server

```sh
pnpm generate && pnpm dev # development
pnpm build && pnpm start # pre-production
```

The project will be available at [http://localhost:3000](http://localhost:3000).

## License

This project is licensed under the [MIT License](LICENSE), and its [contents](content) are under the [CC BY-ND 4.0 License](content/LICENSE).

**Cheers!**
