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
  name?: any;
  address?: any;
  email?: any;
  avatar?: any;
  id?: any;
}

interface ChartType {
  date: number;
  price: number;
}

interface AuthContextType {
  credentials: UserType | null;
  isFetchingUser: boolean;
  isError: string | null;
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

//
