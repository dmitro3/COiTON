include .env


# deployContract:
# 	forge create --rpc-url ${RPC_URL} \
#     --private-key ${PRIVATE_KEY} \
#     --etherscan-api-key ${ETHERSCAN_API_KEY} \
#     --verify \
#     src/ENS.sol:ENS


verifyContract:
	forge verify-contract \
    --num-of-optimizations 1000000 \
    --watch \
	--constructor-args 0xC0E11e7674B3267175569e1c42b85bB5554aFEB4 0xFe9FeC90E3fD273579EEbE3cFE14Dd356B0d76a4 0xC0E11e7674B3267175569e1c42b85bB5554aFEB4 \
	--verifier blockscout --verifier-url https://sepolia-blockscout.lisk.com/api? \
	--rpc-url ${RPC_URL} \
    --etherscan-api-key ${ETHERSCAN_API_KEY} \
    $(contract) \
    contracts/Diamond.sol:Diamond





# verify:
# 	forge create --rpc-url ${RPC_URL} --private-key ${PRIVATE_KEY} contracts/Diamond.sol:Diamond --constructor-args 0xC0E11e7674B3267175569e1c42b85bB5554aFEB4 0xFe9FeC90E3fD273579EEbE3cFE14Dd356B0d76a4 0xC0E11e7674B3267175569e1c42b85bB5554aFEB4 --verify --verifier blockscout --verifier-url https://sepolia-blockscout.lisk.com/api? 

verify:
	forge verify-contract \
	--rpc-url ${RPC_URL} \
	--constructor-args 0xC0E11e7674B3267175569e1c42b85bB5554aFEB4 0xFe9FeC90E3fD273579EEbE3cFE14Dd356B0d76a4 0xC0E11e7674B3267175569e1c42b85bB5554aFEB4 \
	--watch \
	--verifier blockscout \
	--verifier-url https://sepolia-blockscout.lisk.com/api? \
	$(contract)
	contracts/Diamond.sol:Diamond



deployLocal:
	yarn hardhat run scripts/deploy.js --network anvil

deployLive:
	yarn hardhat run scripts/deploy.js --network op

abigen:
	node scripts/generateDiamondABI.js

runDao:
	yarn hardhat run scripts/interractions/daoSettings.js --network op

approve:
	yarn hardhat run scripts/interractions/approve.js --network anvil

approveListing:
	yarn hardhat run scripts/interractions/approveListing.js --network anvil

getListings:
	yarn hardhat run scripts/interractions/getListings.js --network anvil