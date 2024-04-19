import { CandlestickChart, LayoutDashboard } from "lucide-react";

export const site: SiteConfigProps = {
  title: "UrbanXchange: Revolutionizing Real Estate Trading in Cities",
  name: "UrbanXchange",
  description:
    "UrbanXchange is a cutting-edge platform at the forefront of the real estate industry's digital transformation. By harnessing the power of blockchain technology, UrbanXchange introduces a decentralized approach to real estate trading, making it accessible to anyone, anywhere.",
};

export const links = [
  {
    name: "Tradings",
    href: "/tradings",
  },
  {
    name: "News",
    href: "/news",
  },
  {
    name: "Account",
    href: "/city-indices",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
];

export const side_links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Trades",
    path: "/dashboard/tradings",
    icon: CandlestickChart,
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
