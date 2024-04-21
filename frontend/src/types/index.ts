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
  owner?: string;
  address: string;
  city: string;
  country: string;
  state: string;
  postalCode: string | number;
  description: string;
  price: string | number;
  images: any[];
}

interface SingleListingType {
  details: ListingType;
  id: string;
  createdAt: string;
  updatedAt: string;
}
