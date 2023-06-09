'use strict';

const{Contract} = require('fabric-contract-api');



class PharmanetContract extends Contract{
    constructor(){
        // Nameing the Smart Contract
        super('Drug-counterfieting.pharmanet');
    }
    // Message to show once the network is instatiated
    async instantiate(ctx){
        console.log('Pharmanet Smart Contract Instantiated');
    }

async registerCompany(ctx, companyCRN, companyName, Location, organisationRole){

    const companyID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.company', [companyName, companyCRN]);
    let hierarchyKeyValue;
    if(organisationRole== "Manufacturer"){
        hierarchyKeyValue = "1";
    }else if(organisationRole== "Distributor"){
        hierarchyKeyValue= "2";
    }else if(organisationRole== "Retailer"){
        hierarchyKeyValue= "3";
    }else if(organisationRole== "Transporter"){
        hierarchyKeyValue= "";
    }else{
        return "Invalid Organisation Role";
    }
    
    let companyObject = {
    companyCRN:companyCRN,
    companyName:companyName,
    Location:Location,
    organisationRole: organisationRole,
    hierarchyKey: hierarchyKeyValue,
    createdAt: ctx.stub.getTxTimestamp()
    }

    let companyBuffer = Buffer.from(JSON.stringify(companyObject));
    await ctx.stub.putState(companyID, companyBuffer);
    return companyObject;
}

async addDrug(ctx, drugName, serialNo, mfgDate, expDate, companyName, companyCRN){

    const companyID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.company', [companyName, companyCRN]);
    let companyBuffer = await ctx.stub.getState(companyID)
    if(companyBuffer){
        let companyObj = JSON.parse(companyBuffer.toString());
        if(companyObj.organisationRole == "Manufacturer"){
            const productID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.product', [drugName, serialNo]);

            let productObject = {
                drugName: drugName,
                serialNumber: serialNo,
                manufacturer: companyID,
                manufacturingDate: mfgDate,
                expiryDate: expDate,
                owner: companyID,
                shipment: '',
                createdAt:ctx.stub.getTxTimestamp()
            };

         let productBuffer = Buffer.from(JSON.stringify(productObject));
         await ctx.stub.putState(productID, productBuffer);
         return productObject;
    }
    else{
        throw new Error("Not authorised to update the data");
    }
    }
    else{
        throw new Error("Invalid Company");
    }
}

async createPO(ctx, buyerName, buyerCRN, sellerName, sellerCRN, drugName, quantity){
    const buyerID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.company', [buyerName, buyerCRN]);
    let buyerBuffer = await ctx.stub.getState(buyerID)
    let buyerObj = JSON.parse(buyerBuffer.toString());
    const sellerID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.company', [sellerName, sellerCRN]);
    let sellerBuffer = await ctx.stub.getState(sellerID)
    let sellerObj = JSON.parse(sellerBuffer.toString());

    if(Number(sellerObj.hierarchyKey) === Number(buyerObj.hierarchyKey)-1){
        const poID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.purchase', [buyerCRN, drugName]);
        let purchaseObj = {
            drugName: drugName,
            quantity: quantity,
            buyer: buyerID,
            seller: sellerID,
            createdAt: ctx.stub.getTxTimestamp()

        };
        let purchaseBuffer = Buffer.from(JSON.stringify(purchaseObj));
        await ctx.stub.putState(poID, purchaseBuffer);
        return purchaseObj;
    }

    else{
        throw new Error ("Not authorised to Buy");
    }
}


async createShipment(ctx, buyerCRN, drugName, listOfAssets, transporterName, transporterCRN){
const poID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.purchase', [buyerCRN, drugName])
let poBuffer = await ctx.stub.getState(poID).catch(err => console.log(err));
if(poBuffer){
    const shipObj = JSON.parse(poBuffer.toString())
    let Assetray = listOfAssets.split(",");
    let asset = [];
    if(shipObj.quantity == Assetray.length){
        
                
                for(let serialNumber of Assetray){
                    let drug1 = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.product', [drugName, serialNumber]);
                    let drug1Buffer = await ctx.stub.getState(drug1).catch(err => console.log(err));
                    
                    if(drug1Buffer){
                        asset.push(drug1);
                    }
                    else{
                        throw new Error("This Serial Number does not exist");
                    }
                } 
            }else{
                    throw new Error("Ordered quantity doesnt match with shipment");
                }
                let transporterKey = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.shipment', [transporterName, transporterCRN])
                let shipmentObject = {
                    shipmentID: poID,
                    creator: ctx.clientIdentity.getID(),
                    assets: asset,
                    transporter: transporterKey,
                    status: 'in-transit',
                    createdAt: ctx.stub.getTxTimestamp()
                    
                };

                for( let update of asset ){

                    let updateBuffer = await ctx.stub.getState(update).catch(err => console.log(err));
                    let updateObj = JSON.parse(updateBuffer.toString());
                        updateObj.owner = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.shipment', [transporterName, transporterCRN]);
                    let updatedBuffer = Buffer.from(JSON.stringify(updateObj));

                    await ctx.stub.putState(update, updatedBuffer);
                }


            let shipBuffer = Buffer.from(JSON.stringify(shipmentObject));
            await ctx.stub.putState(poID, shipBuffer);
            return shipmentObject;
    
}else{
    throw new Error("There is not data available associated with these keys")
}
}

async updateShipment(ctx, buyerName, buyerCRN, drugName, transporterName, transporterCRN){
    const poID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.purchase', [drugName, buyerCRN])
    const poBuffer = await ctx.stub.getState(poID).catch(err => console.log(err));
    if(poBuffer){
        const shipObj = JSON.parse(poBuffer.toString())
        const transp = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.shipment', [transporterName, transporterCRN])
        if(shipObj.transporter == transp){
            shipObj.status = 'delivered';
            shipObj.updatedAt = ctx.stub.getTxTimestamp();
            const shipDetailsBuffer = Buffer.from(JSON.stringify(shipObj));
            await ctx.stub.putState(poID, shipDetailsBuffer);

            let Asts = shipObj.assets
            for (let update of Asts){
                let updateBuffer = await ctx.stub.getState(update).catch(err => console.log(err));
                let updateObj = JSON.parse(updateBuffer.toString());
                updateObj.shipment = poID;
                updateObj.owner = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.company', [buyerName, buyerCRN]);
                let updatedBuffer = Buffer.from(JSON.stringify(updateObj));
                await ctx.stub.putState(poID, updatedBuffer);
            }


        }else{
            throw new Error("You are not authorised to update this shipment");
        }
        

    }else{
        throw new Error("There is no data available associated with these keys");
    }


}

async retailDrug(ctx, drugName, serialNo, retailerName, retailerCRN, customerAadhar){
    const productID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.product', [drugName, serialNo]);
    let retailBuffer = await ctx.stub.getState(productID).catch(err => console.log(err));
    if(retailBuffer){
        let retailObj = JSON.parse(retailBuffer.toString());
        const retailerID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.company', [retailerName, retailerCRN]);
        if(retailObj.owner ==retailerID ){
        const productID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.product', [drugName, serialNo]);
        const productBuffer = await ctx.stub.getState(productID).catch(err => console.log(err));
        if(productBuffer){
            let productObj = JSON.parse(productBuffer.toString());
            productObj.owner = customerAadhar;
            let productnewBuffer = Buffer.from(JSON.stringify(productObj));
            await ctx.stub.putState(productID, productnewBuffer);
        }else{
            throw new Error("There is no data available associated with these keys");
        }
        }else{
            throw new Error("This retailer is not the actual owner of this drug");
        }
    }else{
        throw new Error("There is no data available associated with these keys");
    }
}

async viewDrugCurrentState(ctx, drugName, serialNo){
    const productID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.product', [drugName, serialNo]);
    const productBuffer = await ctx.stub.getState(productID).catch(err => console.log(err));
    if(productBuffer){
        let productObj = JSON.parse(productBuffer.toString());
        return productObj;
    }else{
        throw new Error("There is no data available associated with these keys");
    }

}

async viewHistory(ctx, drugName, serialNo) {
        
        const productID = ctx.stub.createCompositeKey('Drug-counterfieting.pharmanet.product', [drugName, serialNo]);
        let iterator = await ctx.stub.getHistoryForKey(productID);
        let history = [];
        let result = await iterator.next();
        while (!result.done) {
          if (result.value) {
            const obj = JSON.parse(result.value.value.toString("utf8"));
            history.push(obj);
          }
          result = await iterator.next();
        }
        await iterator.close();
        return history;
      }
    
    }

    module.exports = PharmanetContract;



