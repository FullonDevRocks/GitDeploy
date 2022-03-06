const Stellar = require("stellar-sdk")
const accounts = require("./Stellar_accounts.json")
const util = require("util")

const server = new Stellar.Server("https://horizon-testnet.stellar.org")

const CheckAccounts = async accounts => {
    const sAccounts = await Promise.all(
        accounts.map(async account => await server.loadAccount(account.publicKey))
    );

    return sAccounts.map(({id, balances}) => ({
        id,
        balances
    })          
        
    )
};

CheckAccounts(accounts).then(
    accounts => console.log(util.inspect(accounts, false, null)))
    .catch(e => {
        console.log(e);
        throw e;
    });