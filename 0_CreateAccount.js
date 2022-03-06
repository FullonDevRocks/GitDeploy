const fs = require("fs")
const Stellar = require("stellar-sdk")

const fileName = "Stellar_accounts.json"

fs.writeFileSync(
    fileName,
    JSON.stringify(["Saptarshi", "Company"].map(name => {
        const pair = Stellar.Keypair.random()

        return {
            name,
            secret: pair.secret(),
            publicKey: pair.publicKey()
            };
        })      
    )
)