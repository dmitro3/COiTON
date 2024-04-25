const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')
const { ethers } = require('hardhat')
async function deployDiamond() {
  // const accounts = await ethers.getSigners()
  // const contractOwner = accounts[0]

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory('DiamondCutFacet')
  const diamondCutFacet = await DiamondCutFacet.deploy()
  await diamondCutFacet.deployed()
  console.log('DiamondCutFacet deployed:', diamondCutFacet.address)
  const ACCOUNT = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  // deploy Diamond
  const Diamond = await ethers.getContractFactory('Diamond')
  const diamond = await Diamond.deploy(
    ACCOUNT,
    diamondCutFacet.address,
    ACCOUNT
  )
  await diamond.deployed()


  // deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
  // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  const DiamondInit = await ethers.getContractFactory('DiamondInit')
  const diamondInit = await DiamondInit.deploy()
  await diamondInit.deployed()
  console.log('DiamondInit deployed:', diamondInit.address)



  const ERC20Token = await ethers.getContractFactory("CoitonERC20")
  const erc20Token = await ERC20Token.deploy(ACCOUNT)


  const ERC721Token = await ethers.getContractFactory("CoitonNFT")
  const erc721Token = await ERC721Token.deploy()

  await erc20Token.deployed();
  console.log("Deployed erc20 token at", erc20Token.address)
  await erc721Token.deployed();
  console.log("Deployed erc721 token at", erc721Token.address)




  await diamond.setToken(erc20Token.address, erc721Token.address);

  // deploy facets
  console.log('')
  console.log('Deploying facets')
  const FacetNames = ['DiamondLoupeFacet', 'OwnershipFacet', 'RealEstate', 'Trade']

  const cut = []
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName)
    const facet = await Facet.deploy()
    await facet.deployed()
    console.log(`${FacetName} deployed: ${facet.address}`)
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet),
    })
  }

  // upgrade diamond with facets
  console.log('')
  console.log('Diamond Cut:', cut)
  const diamondCut = await ethers.getContractAt('IDiamondCut', diamond.address)
  let tx
  let receipt
  // call to init function
  let functionCall = diamondInit.interface.encodeFunctionData('init')
  tx = await diamondCut.diamondCut(cut, diamondInit.address, functionCall)
  console.log('Diamond cut tx: ', tx.hash)
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
  console.log('Completed diamond cut')
  console.log("\n-------------------------------------\n")
  console.log('Diamond deployed at:', diamond.address)

  return diamond.address
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployDiamond()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

exports.deployDiamond = deployDiamond
