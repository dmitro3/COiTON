export const variables = {
  // ? SUPABASE
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // ? NEXTAUTH
  authUrl: process.env.NEXTAUTH_URL!,
  authSecret: process.env.NEXTAUTH_SECRET!,
  secretSession: process.env.SESSION_SECRET!,
  // ? CONTRACT VARIABLES
  adminAddress: process.env.NEXT_PUBLIC_ADMIN_ADDRESS!,
  diamondAddress: process.env.NEXT_PUBLIC_DIAMOND_ADDRESS!,
  daoAddress: process.env.NEXT_PUBLIC_DAO_ADDRESS!,
  erc20Address: process.env.NEXT_PUBLIC_ERC20_ADDRESS!,
  erc721Address: process.env.NEXT_PUBLIC_ERC721_ADDRESS!,
  // ? OTHERS
  mapKey: process.env.NEXT_PUBLIC_MAP_API_KEY!,
  w3mProjectId: process.env.NEXT_PUBLIC_W3M_PROJECT_ID!,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
  renderEndpoint: process.env.NEXT_PUBLIC_RENDER_ENDPOINT!,
  ipfsGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY!,
};
