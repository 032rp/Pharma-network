# Approve for Manufacturer Organisation(Approval can be done from any peer of this org)
export CORE_PEER_LOCALMSPID="manufacturerMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/manufacturer.pharma-network.com/peers/peer0.manufacturer.pharma-network.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp
export CORE_PEER_ADDRESS=localhost:7051
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.pharma-network.com --tls --cafile $ORDERER_CA --channelID pharmanet --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE}
# Approve for Distributor Organisation
export CORE_PEER_LOCALMSPID="distributorMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/distributor.pharma-network.com/peers/peer0.distributor.pharma-network.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp
export CORE_PEER_ADDRESS=localhost:9051
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.pharma-network.com --tls --cafile $ORDERER_CA --channelID pharmanet --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE}

# Approve for Retailer Organisation
export CORE_PEER_LOCALMSPID="retailerMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/retailer.pharma-network.com/peers/peer0.retailer.pharma-network.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp
export CORE_PEER_ADDRESS=localhost:11051
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.pharma-network.com --tls --cafile $ORDERER_CA --channelID pharmanet --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE}

# Approve for Consumer Organisation
export CORE_PEER_LOCALMSPID="consumerMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/consumer.pharma-network.com/peers/peer0.consumer.pharma-network.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp
export CORE_PEER_ADDRESS=localhost:13051
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.pharma-network.com --tls --cafile $ORDERER_CA --channelID pharmanet --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE}


# Approve for Transporter Organisation
export CORE_PEER_LOCALMSPID="transporterMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/transporter.pharma-network.com/peers/peer0.transporter.pharma-network.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp
export CORE_PEER_ADDRESS=localhost:15051
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.pharma-network.com --tls --cafile $ORDERER_CA --channelID pharmanet --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE}
