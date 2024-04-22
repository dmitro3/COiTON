import { CandlestickChart, LayoutDashboard } from "lucide-react";

export const site: SiteConfigProps = {
  title:
    "COiTON: Collaborative Onchain Investment and Trading of Neighborhoods",
  name: "COiTON",
  description:
    "COiTON is a cutting-edge platform at the forefront of the real estate industry's digital transformation. By harnessing the power of blockchain technology, COiTON introduces a decentralized approach to real estate trading, making it accessible to anyone, anywhere.",
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

export const listings: SingleListingType[] = [
  {
    details: {
      owner: "0x42AcD393442A1021f01C796A23901F3852e89Ff3",
      address: "Ikorodu",
      city: "lagos",
      country: "Nigeria",
      state: "lagos",
      postalCode: "123123",
      description: "1 sqr meter land with 4 buildings",
      price: "4000000",
      images: ["/img/banner.avif", "sdfasdf"],
    },
    id: "32596465-8470-4168-873a-28d7ee44fa6d",
    createdAt: "2024-04-20T21:28:39.842Z",
    updatedAt: "2024-04-20T21:28:39.842Z",
  },
  {
    details: {
      owner: "0x42AcD393442A1021f01C796A23901F3852e89Ff3",
      address: "Ikorodu",
      city: "lagos",
      country: "Nigeria",
      state: "lagos",
      postalCode: "123123",
      description: "1 sqr meter land with 4 buildings",
      price: "50000",
      images: ["/img/banner.jpeg", "sdfasdf"],
    },
    id: "1b2544d3-cc2e-4682-bc22-76571de0682d",
    createdAt: "2024-04-20T21:28:19.095Z",
    updatedAt: "2024-04-20T21:28:19.095Z",
  },
];
