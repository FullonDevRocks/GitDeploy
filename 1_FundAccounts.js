const axios = require("axios");
const accounts = require("./Stellar_accounts.json");

const FundAccounts = async accounts => 
    await Promise.all(
        accounts.map(
            async account => 
                await axios.get("/friendbot", {
                    baseURL: "https://horizon-testnet.stellar.org",
                    params: { addr: account.publicKey  }
                })
        )
    )

FundAccounts(accounts).then(
    () => console.log("OK")).catch(
        e => {
            console.log(e);
            throw e;
        }
    );