const Stellar = require("stellar-sdk")
const accounts = require("../accounts.json")
const { TimeoutInfinite } = require("stellar-base")

const server = new Stellar.Server("https://horizon-testnet.stellar.org")

const runTransaction = async (ComPubKey, ComSecKey, SapPubKey) => {
    const standardFee = await server.fetchBaseFee()

    const txOptions = {
        fee : standardFee,
        networkPassphrase : Stellar.Networks.TESTNET
    };

    const PaymentToSaptarshi = {
        destination : SapPubKey,
        asset : Stellar.Asset.native(),
        amount : "100"
    };

    const CompanyAccount = await server.loadAccount(ComPubKey);

    const transaction = new Stellar.TransactionBuilder(CompanyAccount, txOptions)
        .addOperation(Stellar.Operation.payment(PaymentToSaptarshi))
        .setTimeout(TimeoutInfinite)
        .build();
    
    transaction.sign(ComSecKey);

    await server.submitTransaction(transaction);
};

const [com, sap] = accounts;

runTransaction(com.publicKey, Stellar.Keypair.fromSecret(com.secret), sap.publicKey)
    .then(() => console.log("OK"))
    .catch(e => {
        console.log(e);
        throw e;
    });
