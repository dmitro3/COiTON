# include .env


# deployContract:
# 	forge create --rpc-url ${RPC_URL} \
#     --private-key ${PRIVATE_KEY} \
#     --etherscan-api-key ${ETHERSCAN_API_KEY} \
#     --verify \
#     src/ENS.sol:ENS


# verifyContract:
# 	forge verify-contract \
#     --chain-id 11155111 \
#     --num-of-optimizations 1000000 \
#     --watch \
#     --etherscan-api-key ${ETHERSCAN_API_KEY} \
#     $(contract) \
#     src/ENS.sol:ENS 



deployLocal:
	yarn hardhat run scripts/deploy.js --network anvil

deployLive:
	yarn hardhat run scripts/deploy.js --network sepolia

abigen:
	node scripts/generateDiamondABI.js

runDao:
	yarn hardhat run scripts/interractions/daoSettings.js --network anvil

approve:
	yarn hardhat run scripts/interractions/approve.js --network anvil

approveListing:
	yarn hardhat run scripts/interractions/approveListing.js --network anvil

getListings:
	yarn hardhat run scripts/interractions/getListings.js --network anvil