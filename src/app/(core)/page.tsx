import Image from 'next/image';
import { SiReact } from 'react-icons/si';

import { constant } from '~/lib/constant';

const { description, authorName } = constant;

const Home = () => {
  return (
    <section className="grid min-h-96 place-items-center">
      <div className="flex flex-col items-center gap-2 md:flex-row md:gap-8">
        <figure className="group relative flex aspect-square h-32 w-32 items-center justify-center rounded-full">
          <div className="animate absolute inset-0 rounded-full shadow-[0_0_25px_#78716c] group-hover:shadow-[0_0_50px_#fef3c7]" />
          <Image
            src="/imgs/avatar.webp"
            alt={`${authorName}\u2019s Identity`}
            fill
            priority
            sizes="128px"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRlYFAABXRUJQVlA4WAoAAAAgAAAASAEAzQAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggaAMAAFAhAJ0BKkkBzgA+kUScSqW5MiGkdKsbIBIJZ27gVRgDUNI4uwFd/aj4P3brq1j0AViadDEH/DgLsfTI6zwZ+BMeCIoKlLqJ4QdQVtVlES0spKp6SRemLCf9JoybDUqNGfIsVixSHJgqWqWfPn5bfffmP8svihSRNwmnFgm3RYooooo+HNxQYsaEhBBiFiFiCCCCCGPiAS5pg1hAGTrrrrrrrrt87bbcQDq3g1FEzZ556FiGNmDjjlHsbRW+opPdgHcVVeAXnq+XL/Tw1ekWuZk7loNQ6NS4K/yPpnA4PpBOUQDzpedh5KZHaPKPKNBJT/gncfTJQga50gaaEPAS63tWLiNdggyaVh5LJCag0PK/qIQAAP7wusb3trw2n6T3gjaLxQxyj6F4GUYJABbwml2RJrw7oZtaZ7SoLqtd32fPtO+SNapSA16aZN87ENjXOEi8HoyZq9lJL7usvgY0DcEESpV+Q5TdTPbFGyXzJ9xbj5Y8BUkllgWImlyeQJSUcylpwkiAiXrgE8RjIWzKV4j2NWMoOPRAAnxG3ijZ4ZX+yKxM4soD0G0uk1g9/2GsWvpAWWVJKtO5RVA+nLeAgoAGDpYLl4Wzj550236+uUZsIRnL+/1xc5+DCXp/NR8ltB08ckjXyPj2EYv4Bpp73vjnle5v0EGfnnZmw3ovDk8qn9jsoF08im1LOaLmyHl0Cxn9E7l4rSyXMnS+i/oeQOvFaGdAd71ni9xobPVLSfxg8Orivo1RYQYLK31XY4COsU60yWbxOHX6yUzduaboza/OKC05K3Jo5hizzwi1dWtrIiDlK70Jrc6a+LR5qoZ8aISLuwm5yLpcQPOJedxYOEXJd/P/WvHBB0NbQ08U4OsUA6U2o/jo0mQVlkiOb+OJMVAHBR6yfwQ6Lapv/ptpj7m6U9t3OBTJwmi0eTLUUENRB7XWVtEuRZbVfKUMXX0uDovbkr/+yFXwShzq8e3pBlIgRF14P/XUXj9k9gZe7tv8a7avwcDnyJEQzgPqG3hDvVu7sQE+D/ZdbNu33g1hVSLJcHSywUfmu0eeobcGyz+Ow3qG3Se423SHbbO5AScI9PIadZFXR9Ncv2WqQdmFDfYdpz5uIRgSd3VHc6156Iu024o1lI9SXwHEQsx/Xx28d4AAAAAAAAAA"
            className="animate z-10 rounded-full object-cover grayscale group-hover:grayscale-0"
          />
        </figure>
        <div className="z-10 flex flex-col text-center md:text-left">
          <h1 className="font-display text-xl font-bold leading-8 tracking-tight text-amber-100">
            {authorName}
          </h1>
          <p className="max-w-md text-xs text-stone-300">
            <mark>{description}</mark>
          </p>
          <div className="mt-4 flex justify-center md:justify-start">
            <a
              href="https://react.dev/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              title="React"
              aria-label="React"
            >
              <SiReact size={24} className="fill-amber-100" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
