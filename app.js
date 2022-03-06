// Imports
const express = require('express')
const { json } = require('express/lib/response')
const res = require('express/lib/response')
const fs = require("fs")
const { stringify } = require('querystring')
const accounts = require("./Stellar_accounts.json")
const app = express()
const port = 3000
const LoginfileName = "accounts.json"
const Stellar = require("stellar-sdk")
const axios = require("axios");
const Stellar_accounts = require("./accounts.json");
const util = require("util")
const server = new Stellar.Server("https://horizon-testnet.stellar.org")
const fileName = "Stellar_accounts.json"
// Static Files
app.use(express.static('public'))
app.use("/css", express.static(__dirname + 'public/css'))
app.use("/img", express.static(__dirname + 'public/img'))
app.use("/js", express.static(__dirname + 'public/js'))

// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')



app.get('/', (req, res) => {
    res.render('index')
})

app.get('/Account', (req, res) => {
    res.render('inner-page')
})

app.get('/signUp', (req, res) => {
    var user = req.query.user;
    var pass = req.query.pass;  
    accounts.push({
            name : user,
            username : user,
            password: pass
        })
    fs.writeFileSync(LoginfileName, JSON.stringify(accounts));
    res.send("Success");
    
});

app.get('/CreateStellarAccount', function(req, res){
    var ureq = req.query.name;
    console.log(ureq)
    fs.writeFileSync(
        fileName,
        JSON.stringify([ureq].map(name => {
            const pair = Stellar.Keypair.random()
    
            return {
                name,
                secret: pair.secret(),
                publicKey: pair.publicKey()
                };
            })      
        )
    )
    res.send("success")
    
    
});

app.get('/CheckAccountBalance', function(req, res){
    var ureq = req.query.name;
    console.log(ureq)
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
        accounts => {
            // console.log(util.inspect(accounts, false, null)))
            var bal = accounts[0].balances[0].balance;
            res.send(bal)
        })
        .catch(e => {
            console.log(e);
            throw e;
        });
    // var parsed = util.inspect(accounts, false, null)
    // console.log(parsed.toString)
    
});

app.get('/fundingAccounts', function(req, res){
    var ureq = req.query.name;
    console.log(ureq)
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
    
    
});

app.get('/makeTransaction', function(req, res){
    var ureq = req.query.name;
    console.log(ureq)
    
    res.send("success")
    
    
});



//  Listen on port 3000
app.listen(port || process.env.PORT, () => console.info('Listening on port ' + port))