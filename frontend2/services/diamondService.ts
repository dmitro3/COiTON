import { ethereum, getDiamondContract, getRequiredSigner } from "@/services";
import { variables } from "@/utils/env";
import { getUnApprovedListings } from "./daoService";
import { ethers } from "ethers";

export const getAllListings = async () => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getDiamondContract();
    const listings = await contract.getListings();

    if (!listings || listings.length === 0) return [];

    const refinedData = listings.map((listing: any) => {
      const [country, state, city, location, propertyType, title, amenities] =
        listing[2].split(";");

      return {
        propertyId: listing[0],
        owner: listing[1],
        agent: listing[1],
        title: title.split("=")[1],
        amenities: amenities.split("=")[1].split("~"),
        country: country.split("=")[1],
        state: state.split("=")[1],
        city: city.split("=")[1],
        address: location.split("=")[1],
        propertyType: propertyType.split("=")[1],
        postalCode: Number(listing[3]),
        description: listing[4],
        price: Number(listing[5]),
        images: listing[6]
          .split(";")
          .map((image: string) => `${variables.ipfsGateway}/${image}`),
        id: Number(listing[7]),
        coverImage: `${variables.ipfsGateway}/${listing[8]}`,
        timestamp: Number(listing[9]),
      };
    });

    return refinedData;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getListingById = async ({
  selectId,
  currentPath,
}: {
  selectId: string;
  currentPath: string;
}) => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    if (currentPath === "approvals") {
      const listings = await getUnApprovedListings();

      const selectedListing = listings.find(
        (item: any) => item.propertyId === selectId
      );

      if (!selectedListing) null;

      return selectedListing;
    } else {
      const listings = await getAllListings();

      const selectedListing = listings.find(
        (item: any) => item.propertyId === selectId
      );

      if (!selectedListing) null;

      return selectedListing;
    }
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getAllAgreements = async () => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const transformListing = (listing: any) => {
      const [country, state, city, location, propertyType, title, amenities] =
        listing[2].split(";");

      return {
        propertyId: listing[0],
        owner: listing[1],
        agent: listing[1],
        title: title.split("=")[1],
        amenities: amenities.split("=")[1].split("~"),
        country: country.split("=")[1],
        state: state.split("=")[1],
        city: city.split("=")[1],
        address: location.split("=")[1],
        propertyType: propertyType.split("=")[1],
        postalCode: Number(listing[3]),
        description: listing[4],
        price: Number(listing[5]),
        images: listing[6]
          .split(";")
          .map((image: string) => `${variables.ipfsGateway}/${image}`),
        id: Number(listing[7]),
        coverImage: `${variables.ipfsGateway}/${listing[8]}`,
        timestamp: Number(listing[9]),
      };
    };

    const contract = await getDiamondContract();
    const signer = await getRequiredSigner();

    const transaction = await contract.getPurchaseAgreementSigners(
      signer.address
    );
    const dt = {
      agr: transaction[0],
      hasSigned: transaction[1],
      listings: transaction[2],
    };

    const data = dt.agr.map((d: any) => {
      const bb = {
        id: Number(d[0]),
        initiator: d[1],
        buyer: d[2],
        estateId: Number(d[3]),
        signersCount: Number(d[4]),
        executed: d[5],
        validSigners: d[6],
      };

      return bb;
    });
    const listings = dt.listings.map(transformListing);

    const signed = dt.hasSigned.map((d: any) => d);

    const allAgreements = data?.reverse()?.map((item: any, index: number) => ({
      ...item,
      signed: signed[index],
      listing: listings[index],
    }));

    return allAgreements;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getInitiatedAgreements = async (tokenId: number) => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getDiamondContract();
    const signer = await getRequiredSigner();

    const result = await contract.getUserInitiatedPurchaseArgument(
      signer.address,
      tokenId
    );

    const refinedData = {
      id: Number(result[0]),
      initiator: result[1],
      buyer: result[2],
      estateId: Number(result[3]),
      signersCount: Number(result[4]),
      executed: result[5],
      validSigners: result[6],
    };

    if (refinedData.initiator === ethers.ZeroAddress) return null;

    return refinedData;
  } catch (error: any) {
    reportError(error);
    throw new Error(error);
  }
};

export const getEstateSigner = async (tokenId: number) => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getDiamondContract();
    const signer = await getRequiredSigner();

    const result = await contract.getEstateSigner(signer.address, tokenId);

    const refinedData = {
      purchaseAgreement: {
        id: Number(result[0][0]),
        initiator: result[0][1],
        buyer: result[0][2],
        estateId: Number(result[0][3]),
        signersCount: Number(result[0][4]),
        executed: result[0][5],
        validSigners: result[0][6],
      },
      hasSigned: result[1],
    };

    if (refinedData.purchaseAgreement.initiator === ethers.ZeroAddress)
      return null;

    return refinedData;
  } catch (error: any) {
    reportError(error);
    throw new Error(error);
  }
};

export const initiatePurchaseAgreement = async ({
  estateId,
  buyer,
  signers,
}: {
  estateId: number;
  buyer: string;
  signers: string[];
}) => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getDiamondContract();

    const transaction = await contract.initiatePurchaseAgreement(
      estateId,
      buyer,
      signers
    );
    const receipt = await transaction.wait();

    if (!receipt.status) {
      throw new Error("Transaction failed");
    }

    return receipt;
  } catch (error: any) {
    reportError(error);
    if (error.reason === "rejected") {
      throw new Error("Transaction rejected");
    } else {
      throw new Error(error.message);
    }
  }
};

export const signPurchaseAgreement = async ({
  estateId,
  buyer,
  price,
  handleStake,
  handleStakeERC721,
}: {
  estateId: any;
  buyer: string;
  price: string;
  handleStake: (amount: string) => Promise<boolean>;
  handleStakeERC721: (tokenId: string) => Promise<boolean>;
}) => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getDiamondContract();
    const signer = await getRequiredSigner();

    let proceed = false;
    if (signer.address.toString() === buyer) {
      const hasApprovedERC20Token = await contract.checkIfApprovedERC20Token(
        estateId,
        signer.address
      );

      if (hasApprovedERC20Token) {
        proceed = true;
      } else {
        proceed = await handleStake(price);
      }
    } else {
      const hasApprovedERC721Token = await contract.checkIfApprovedERC721Token(
        estateId
      );

      if (hasApprovedERC721Token) {
        proceed = true;
      } else {
        proceed = await handleStakeERC721(estateId);
      }
    }

    if (!proceed) return;

    const transaction = await contract.signPurchaseAgreement(estateId);
    const receipt = await transaction.wait();

    if (!receipt.status) {
      throw new Error("Transaction failed");
    }

    return receipt;
  } catch (error: any) {
    reportError(error);
    if (error.reason === "rejected") {
      throw new Error("Transaction rejected");
    } else {
      throw new Error(error.message);
    }
  }
};

export const sellShares = async ({
  estateId,
  shares,
}: {
  estateId: any;
  shares: string;
}) => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getDiamondContract();

    const transaction = await contract.signPurchaseAgreement(estateId, shares);
    const receipt = await transaction.wait();

    if (!receipt.status) {
      throw new Error("Transaction failed");
    }

    return receipt;
  } catch (error: any) {
    reportError(error);
    if (error.reason === "rejected") {
      throw new Error("Transaction rejected");
    } else {
      throw new Error(error.message);
    }
  }
};

export const getMarket = async () => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getDiamondContract();

    const markets = await contract.getMarket();

    if (!markets) return [];

    const refinedData =
      markets &&
      markets?.map((market: any) => {
        const [owner, title, amenities] = market[1][1].split(";");
        const [country, state, city, address] = market[1][2].split(";");

        return {
          market: {
            tokenId: Number(market[0].tokenId.toString()),
            currentPrice: Number(market[0].currentPrice.toString()),
            consumedShares: Number(market[0].consumedShares.toString()),
            stakeHolders: market[0].stakeHolders,
          },
          listing: {
            propertyId: market[1][0],
            owner,
            title,
            amenities,
            country,
            state,
            city,
            address,
            postalCode: Number(market[1][3]),
            description: market[1][4],
            price: Number(market[1][5]),
            images: market[1][6]
              .split(";")
              .map((image: string) => `${variables.ipfsGateway}/${image}`),
            id: Number(market[1][7]),
            coverImage: `${variables.ipfsGateway}/${market[1][8]}`,
            timestamp: Number(market[1][9]),
          },
        };
      });

    return refinedData;
  } catch (error: any) {
    reportError(error);
    if (error.reason === "rejected") {
      throw new Error("Transaction rejected");
    } else {
      throw new Error(error.message);
    }
  }
};
