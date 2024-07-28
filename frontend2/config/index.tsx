import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { variables } from "@/utils/env";

const coreDao = {
  id: 1115,
  name: "Core Blockchain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Core",
    symbol: "tCORE",
  },
  rpcUrls: {
    default: {
      http: [variables?.rpcUrl || variables?.wssUrl],
    },
  },
  blockExplorers: {
    default: {
      name: "CoreDao",
      url: "https://scan.test.btcs.network/",
    },
  },
  testnet: true,
};

export const siteConfig = {
  title: "COiTON",
  description:
    "COiTON is a cutting-edge platform at the forefront of the real estate industry's digital transformation. By harnessing the power of blockchain technology, COiTON introduces a decentralized approach to real estate trading, making it accessible to anyone, anywhere.",
  slogan: "Collaborative Onchain investment and Trading of Neighborhoods",
  url: "https://coiton.vercel.app/",
  icon: "/img/logo.png",
};

export const projectId = variables?.w3mProjectId;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: siteConfig.title,
  description: siteConfig.description,
  url: siteConfig.url, // origin must match your domain & subdomain
  icons: [siteConfig.icon],
};

// Create wagmiConfig
const chains = [coreDao] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  auth: {
    email: false,
  },
});

// export const siweConfig = createSIWEConfig({
//   getMessageParams: async () => ({
//     domain: typeof window !== "undefined" ? window.location.host : "",
//     uri: typeof window !== "undefined" ? window.location.origin : "",
//     chains: [coreDao.id],
//     statement: `To effectively utilize ${siteConfig.title}, you must sign with your account to verify ownership.`,
//   }),
//   createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
//     formatMessage(args, address),
//   getNonce: async () => {
//     const nonce = await getCsrfToken();
//     if (!nonce) {
//       throw new Error("Failed to get nonce!");
//     }
//     return nonce;
//   },
//   getSession: async () => {
//     const session = await getSession();
//     if (!session) {
//       throw new Error("Failed to get session!");
//     }

//     const { address, chainId } = session as unknown as SIWESession;

//     return { address, chainId };
//   },
//   verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
//     try {
//       const success = await signIn("credentials", {
//         message,
//         redirect: false,
//         signature,
//         callbackUrl: "/protected",
//       });

//       return Boolean(success?.ok);
//     } catch (error) {
//       return false;
//     }
//   },
//   signOut: async () => {
//     try {
//       await signOut({ redirect: false });
//       return true;
//     } catch (error) {
//       return false;
//     }
//   },
// });
