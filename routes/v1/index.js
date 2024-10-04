import express from 'express'
import userRoute from './userRoute.js'
import bookDetails from './busDetailsRoute.js'
import seat from './seatRoute.js'
import passenger from './passgenerRoute.js'
import payment from './paymentRoute.js'
import nodeMailer from './nodeMailerRoute.js'
import admin from './adminRoute.js'
const v1Router=express.Router();

v1Router.use("/user",userRoute)
v1Router.use("/bus",bookDetails)
v1Router.use("/seat",seat)
v1Router.use("/passenger",passenger)
v1Router.use("/payment",payment)
v1Router.use("/nodemailer",nodeMailer)
v1Router.use("/admin",admin)


export default v1Router 