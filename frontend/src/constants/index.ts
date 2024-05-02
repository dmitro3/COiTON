import { createClient } from "@/utils/supabase/client";

export const supabase = createClient();

export const site: SiteConfigProps = {
  title:
    "COiTON: Collaborative Onchain Investment and Trading of Neighborhoods",
  name: "COiTON",
  description:
    "COiTON is a cutting-edge platform at the forefront of the real estate industry's digital transformation. By harnessing the power of blockchain technology, COiTON introduces a decentralized approach to real estate trading, making it accessible to anyone, anywhere.",
  url: "https://coiton.vercel.app/",
};

export const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Tradings",
    href: "/tradings",
  },
  {
    name: "News",
    href: "/news",
  },
  {
    name: "Terms & Conditions",
    href: "/terms-and-conditions",
  },
];

export const sliderSettings = ({
  sts1,
  sts2,
}: {
  sts1: number;
  sts2: number;
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: sts1,
    slidesToScroll: 1,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: sts2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  return settings;
};

export const dummyCharts: ChartType[] = [
  {
    date: new Date("2024-04-01").getTime(),
    price: 239,
  },
  {
    date: new Date("2024-04-02").getTime(),
    price: 238,
  },
  {
    date: new Date("2024-04-03").getTime(),
    price: 286,
  },
  {
    date: new Date("2024-04-04").getTime(),
    price: 44,
  },
  {
    date: new Date("2024-04-05").getTime(),
    price: 259,
  },
];
