const { default: axios } = require("axios");
const { exchange } = require("../../helpers/ContractInterraction");

require("dotenv").config();
const PAYSTACK_SEC_KEY = process.env.PAYSTACK_SEC_KEY;


exports.initiateTx = async (req, res) => {
    try {
        const { ref } = req.params;
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${ref}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SEC_KEY}`
            }
        });
        if (response.data.status) {
            const AMOUNT = response.data.data.amount / 100;
            const getRateConversion = await axios.get("https://v6.exchangerate-api.com/v6/88c7b20eceeae9fe4682302a/pair/USD/NGN");
            const exchangePrice = AMOUNT / (Math.round(getRateConversion.data.conversion_rate));
            const tx = await exchange(req.body.address, (exchangePrice * 10e18).toString())
            res.send({ success: true, message: "Transaction successful", data: response.data, rate: getRateConversion.data, exchangePrice, tx });
        } else {
            res.send({ success: false, message: "Transaction successful", data: response.data });
        }
    } catch (error) {
        res.send({ success: false, message: error.message })
    }
}