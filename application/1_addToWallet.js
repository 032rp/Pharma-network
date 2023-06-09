'use strict';

/**
 * This is a Node.JS module to load a user's Identity to his wallet.
 * This Identity will be used to sign transactions initiated by this user.
 * Defaults:
 *  User Name: ORG1_ADMIN
 *  User Organization: ORG1
 *  User Role: Admin
 *
 */

const fs = require('fs'); // FileSystem Library
const { Wallets} = require('fabric-network'); // Wallet Library provided by Fabric

async function main(certificatePath, privateKeyPath, organisationRole) {
	
	// Main try/catch block
	try {
		
		// A wallet is a filesystem path that stores a collection of Identities
		const wallet = await Wallets.newFileSystemWallet('./identity/'+ organisationRole.toLowerCase());
		
		// Fetch the credentials from our previously generated Crypto Materials required to create this user's identity
		const certificate = fs.readFileSync(certificatePath).toString();
		const privatekey = fs.readFileSync(privateKeyPath).toString();
		
		// Load credentials into wallet
		const identityLabel = organisationRole.toUpperCase()+'_ADMIN';
		const identity = {
			credentials: {
				certificate: certificate,
				privateKey: privatekey
			},
			mspId: organisationRole.toLowerCase()+'MSP',
			type: 'X.509'
		};
		
		await wallet.put(identityLabel, identity);
        console.log("Successfully added Identity to the wallet");
		
	} catch (error) {
		console.log(`Error adding to wallet. ${error}`);
		console.log(error.stack);
		throw new Error(error);
	}
}

// const certificatePath = '/home/ram/pharma-network/network/organizations/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/signcerts/Admin@manufacturer.pharma-network.com-cert.pem';
// const privateKeyPath = '/home/ram/pharma-network/network/organizations/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/keystore/priv_sk';
// // main(certificatePath, privateKeyPath, "Manufacturer");

// const certificatePath = '/home/ram/pharma-network/network/organizations/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/signcerts/Admin@transporter.pharma-network.com-cert.pem';
// const privateKeyPath = '/home/ram/pharma-network/network/organizations/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/keystore/priv_sk';
// main(certificatePath, privateKeyPath, "Transporter");

// const certificatePath = '/home/ram/pharma-network/network/organizations/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/signcerts/Admin@distributor.pharma-network.com-cert.pem';
// const privateKeyPath = '/home/ram/pharma-network/network/organizations/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/keystore/priv_sk';
// main(certificatePath, privateKeyPath, "Distributor");

// const certificatePath = '/home/ram/pharma-network/network/organizations/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/signcerts/Admin@retailer.pharma-network.com-cert.pem';
// const privateKeyPath = '/home/ram/pharma-network/network/organizations/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/keystore/priv_sk';
// main(certificatePath, privateKeyPath, "Retailer");

// const certificatePath = '/home/ram/pharma-network/network/organizations/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/signcerts/Admin@consumer.pharma-network.com-cert.pem';
// const privateKeyPath = '/home/ram/pharma-network/network/organizations/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/keystore/priv_sk';
// main(certificatePath, privateKeyPath, "Consumer");

module.exports.execute = main;
