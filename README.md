[![Deploy w/ Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fauziralpiandi/zira.my.id)

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

## Database Schema

```sql
CREATE TABLE likes (
  slug TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);
```

## License

This project is licensed under the [MIT License](LICENSE), and its [contents](content) are under the [CC BY-ND 4.0 License](content/LICENSE).

**Cheers!**
