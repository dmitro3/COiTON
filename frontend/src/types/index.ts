interface MaxWrapperProps {
  children: React.ReactNode;
  className?: string;
}

interface SiteConfigProps {
  title: string;
  name: string;
  description: string;
  url: string;
}

interface UserType {
  name: string;
  address: string;
  email: string;
  avatar: string;
  id: string | undefined;
}

interface ChartType {
  date: number;
  price: number;
}

interface AuthContextType {
  credentials?: UserType | any;
  isFetchingUser?: boolean | any;
  isError?: string;
}

interface ListingType {
  owner: string | undefined;
  address: string;
  city: string;
  country: string;
  state: string;
  description: string;
  images: any[];
  postalCode: string;
  price: string;
  features: string[];
}

interface SingleListingType {
  details:
    | Pick<ListingType, "owner" | "description" | "images" | "price">
    | ListingType;
  id: string;
  createdAt: string;
  updatedAt: string;
}
