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
