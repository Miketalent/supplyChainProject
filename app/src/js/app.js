import Web3 from "web3";
import supplyChainArtifact from "../../../build/contracts/SupplyChain.json";
const App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    },

      initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = new Web3(window.ethereum);
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];
            console.log("id is" + App.metamaskAccountID);

        })
    },

    initSupplyChain: async function () {        
        // get contract instance
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = supplyChainArtifact.networks[networkId];
        App.contracts.SupplyChain = new web3.eth.Contract(
            supplyChainArtifact.abi,
            deployedNetwork.address,
        );

         App.fetchItemBufferOne();
         App.fetchItemBufferTwo();
         App.fetchEvents();

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            }
    },

    harvestItem: async function(event) {
        event.preventDefault();

        const {harvestItem} = App.contracts.SupplyChain.methods;

        try {
            const result = await harvestItem(
                App.upc, 
                App.metamaskAccountID, 
                App.originFarmName, 
                App.originFarmInformation, 
                App.originFarmLatitude, 
                App.originFarmLongitude, 
                App.productNotes
            );
            $("#ftc-item").text(result);
            console.log('harvestItem',result);
        }catch(err) {
            console.log(err.message);
        };
    },

    processItem: async function (event) {
        event.preventDefault();

        const {processItem} = App.contracts.SupplyChain.methods;

        try {
            const result = await processItem(App.upc).send({from: App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('processItem',result);
        } catch(err) {
            console.log(err.message);
        };
    },
    
    packItem: async function (event) {
        event.preventDefault();

        const {packItem} = App.contracts.SupplyChain.methods;
        
        try {
            const result = await packItem(App.upc).send({from: App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('packItem',result);
        } catch(err) {
            console.log(err.message);
        };
    },

    sellItem: async function (event) {
        event.preventDefault();

        const {sellItem} = App.contracts.SupplyChain.methods;
        const productPrice = web3.utils.toWei("1", "ether");
        console.log('productPrice',productPrice);

        try {
            const result = await sellItem(App.upc, App.productPrice).send({from: App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('sellItem',result);
        }catch(err) {
            console.log(err.message);
        };
    },

    buyItem: async function (event) {
        event.preventDefault();

        const {buyItem} = App.contracts.SupplyChain.methods;
        const walletValue = web3.utils.toWei("3", "ether");

        try{
            const result = await buyItem(App.upc).send({from: App.metamaskAccountID, value: walletValue})
            $("#ftc-item").text(result);
            console.log('buyItem',result);
        }catch(err) {
            console.log(err.message);
        };
    },

    shipItem: async function (event) {
        event.preventDefault();

        const {shipItem} = App.contracts.SupplyChain.methods;

        try {
            const result = await shipItem(App.upc).send({from: App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('shipItem',result);
        } catch(err) {
            console.log(err.message);
        };
    },

    receiveItem: async function (event) {
        event.preventDefault();

        const {receiveItem} = App.contracts.SupplyChain.methods;

        try {
            const result = await receiveItem(App.upc).send({from: App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
        }catch(err) {
            console.log(err.message);
        };
    },

    purchaseItem: async function (event) {
        event.preventDefault();

        const {purchaseItem} = App.contracts.SupplyChain.methods;

        try {
            const result = await purchaseItem(App.upc).send({from: App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
        }catch(err) {
            console.log(err.message);
        };
    },

    fetchItemBufferOne: async function () {
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        const {fetchItemBufferOne} = App.contracts.SupplyChain.methods;

        try {
            const result = await fetchItemBufferOne(App.upc).call();
            $("#ftc-item").text(result);
            console.log('fetchItemBufferOne', result);
        } catch(err) {
          console.log(err.message);
        }
    },

    fetchItemBufferTwo: async function () {              
        const {fetchItemBufferTwo} = App.contracts.SupplyChain.methods;

        try {
            const result = await fetchItemBufferTwo(App.upc).call();
            $("#ftc-item").text(result);
            console.log('fetchItemBufferTwo', result);
        } catch(err) {
          console.log(err.message);
        }
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        const {allEvents} = App.contracts.SupplyChain.events;

        try {
            allEvents(function(err, log){
                if (!err)
                    $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
            });
        } catch(err) {
            console.log(err.message);
        };
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
