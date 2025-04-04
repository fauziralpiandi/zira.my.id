[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fauziralpiandi/zira.my.id)

# zira.my.id

My personal website built with:

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Content SDK:** [Contentlayer 2](https://github.com/timlrx/contentlayer2)
- **Database:** [Neon Database](https://neon.tech/)
- **Analytics:** [Vercel Analytics](https://vercel.com/docs/analytics)
- **API Integration:** [Spotify API](https://developer.spotify.com/)
- **Deployment:** [Vercel](https://vercel.com/home)

## Getting Started

Clone the repository and install dependencies:

```sh
git clone https://github.com/fauziralpiandi/zira.my.id.git
cd zira.my.id
pnpm install
```

Create a `.env.local` file in the root directory and add the following environment variables:

```sh
DATABASE_URL=your_neon_database_url
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
```

Start the server:

```sh
pnpm generate && pnpm dev # development
pnpm build && pnpm start # pre-production
```

The project will be available at [http://localhost:3000](http://localhost:3000).

## License

This project is licensed under the [MIT License](LICENSE), and its [contents](content) are under the [CC BY-ND 4.0 License](content/LICENSE).

**Cheers!**
