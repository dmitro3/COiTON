// "use client";

// import { useAccount, useReadContract, useWriteContract } from "wagmi";
// import DIAMOND_CONTRACT_ABI from "@/json/diamond.json";
// import { useEffect, useState } from "react";

// export const useFetchListings = (shouldFetchData: boolean) => {
//   const { address } = useAccount();
//   const { writeContractAsync } = useWriteContract();
//   // const { refetch } = useReadContract();

//   const [isLoading, setIsLoading] = useState(true);
//   const [listings, setListings] = useState<any | null>(null);

//   async function fetchListings() {
//     setIsLoading(true);
//     try {
//       // Example: fetching data for estateId "1"
//       const {data} = useReadContract({
//         abi: DIAMOND_CONTRACT_ABI,
//         address: "0x6682104FA7e474DB3434a1aa8Bb7E9f7FD5A295E",
//         functionName: "getListings",
//       });
//       console.log(data);
//       // setListings(result);
//     } catch (error) {
//       // Handle error
//     } finally {
//       setIsLoading(false);
//     }
//     }

//     useEffect(() => {
//       if (shouldFetchData) {
//         fetchListings();
//         return;
//       }
//     }, [shouldFetchData]);

//   async function getUserInitiatedPurchaseArgument(estateId: string) {
//     // Implementation here
//   }

//   async function getEstateSigner(estateId: string) {
//     // Implementation here
//   }

//   async function signPurchaseAgreement(estateId: string) {
//     // Implementation here
//   }

//   return {
//     isLoading,
//     listings,
//     getUserInitiatedPurchaseArgument,
//     getEstateSigner,
//     signPurchaseAgreement,
//   };
// };
