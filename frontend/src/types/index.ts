interface MaxWrapperProps {
  children: React.ReactNode;
  className?: string;
}

interface SiteConfigProps {
  title: string;
  name: string;
  description: string;
}

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isFetchingUser: boolean;
  registerUser: (data: { email: string; address: string }) => void;
  loginUser: (data: { email: string; address: string }) => void;
  logoutUser: () => void;
  checkUserStatus: () => void;
}

interface UserType {
  avatar: string;
  name: string;
  email: string;
  id: string;
  registration: string;
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
}

interface SingleListingType {
  details:
    | Pick<ListingType, "owner" | "description" | "images" | "price">
    | ListingType;
  id: string;
  createdAt: string;
  updatedAt: string;
}
