import  axios from 'axios';
import  crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler.js';


let salt_key="96434309-7796-489d-8924-ab56988a6076"
let merchant_id='PGTESTPAYUAT86'     
 let mobile="9854256325"                    
export const MakeAmount = asyncHandler(async(req,res)=>{
   
   
    const { name,MUID,transactionId,amount}=req.body
console.log(req.body);

    const data={
        merchantId:merchant_id,
        merchantTransactionId:transactionId,
        name:name,
        amount:amount * 100,
        redirectUrl:`https://bookme-dkx5.onrender.com/api/v1/payment/status?id=${transactionId}`,
        redirectMode:"POST",
        mobileNumber:mobile,
        paymentInstrument:{
            type:"PAY_PAGE"
        }
     }       // redirectUrl:`http://localhost:3690/api/v1/payment/status?id=${transactionId}`,

   
    const payload=JSON.stringify(data);
    const payloadMain=Buffer.from(payload).toString('base64')

    const string=payloadMain + '/pg/v1/pay' + salt_key

    const sha256=crypto.createHash('sha256').update(string).digest('hex');

    const checksum= sha256 + '###' + 1;


    const prod_URL="https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"

    const options={
        method:'POST',
        url:prod_URL,
        headers:{
            'accept':"application/json",
            "Content-Type":"application/json",
            "X-VERIFY":checksum
        },
        data:{
            request:payloadMain
        }
        
    }
    await axios(options).then(response=>{
        res.status(200).json(response.data)
    }).catch(error=>{
        console.log(error.message)
        res.status(500).json({message:error.message})
    })
})



export const CheckStatus =asyncHandler(async(req,res)=>{
    const merchantTransactionId=req.query.id
    const merchantId=merchant_id

    const keyIndex=1
    const string=`/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key
    const sha256=crypto.createHash('sha256').update(string).digest('hex');
    const checksum= sha256 + '###' + keyIndex;



    const options = {
        method: 'GET',
        url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
        headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              'X-VERIFY':checksum,
              'X-MERCHANT-ID':merchantId,
                      },
      
      };
      await axios(options).then(response=>{
        console.log("uyuyuy",response.data);
        if(response.data.success===true){
            const url =`${process.env.CLIENT_DOMAIN}/payment/scuess`
            return res.redirect(url)
        }else{
            const url =`${process.env.CLIENT_DOMAIN}/payment/failure`
            return res.redirect(url)
        }
      })
})