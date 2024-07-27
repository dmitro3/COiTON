import { ethereum, getDAOContract } from "@/services";
import { variables } from "@/utils/env";

export const getUnApprovedListings = async () => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getDAOContract();
    const listings = await contract.getUnApprovedAssigns("Abia");

    if (!listings) return [];

    return listings.map((unapproved: any) => {
      const [country, state, city, location, propertyType, title, amenities] =
        unapproved[0][2].split(";");

      return {
        owner: unapproved[0][0],
        agent: unapproved[0][1],
        title: title.split("=")[1],
        amenities: amenities.split("=")[1].split("~"),
        country: country.split("=")[1],
        state: state.split("=")[1],
        city: city.split("=")[1],
        address: location.split("=")[1],
        propertyType: propertyType.split("=")[1],
        postalCode: Number(unapproved[0][3]),
        description: unapproved[0][4],
        price: Number(unapproved[0][5]),
        images: unapproved[0][6]
          .split(";")
          .map((image: string) => `${variables.ipfsGateway}/${image}`),
        coverImage: `${variables.ipfsGateway}/${unapproved[0][7]}`,
        propertyId: unapproved[0][8],
        timestamp: Number(unapproved[1]),
        id: Number(unapproved[2]),
        approved: unapproved[3],
      };
    });
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const approveListing = async ({
  state,
  id,
  propertyId,
}: {
  state: string;
  id: number;
  propertyId: string;
}) => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getDAOContract();

    const transaction = await contract.approveListing(state, id, propertyId);
    const result = await transaction.wait();

    if (result && !result.status) {
      throw new Error("Transaction failed");
    }

    return result;
  } catch (error: any) {
    reportError(error);
    if (error.reason === "rejected") {
      throw new Error("Transaction rejected");
    } else {
      throw new Error(error.message);
    }
  }
};
