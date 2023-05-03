import express from "express";
import apiController from "../controllers/apiController";
let router = express.Router();

const initApiRoute = (app) => {
  router.get("/dangnhap", apiController.getSignIn);
  router.get("/dangky", apiController.getSignUp);
  router.post("/signUp-New-User", apiController.signUpNewUser);
  router.post("/signIn-User", apiController.signInUser);
  router.get("/trangchu", apiController.getHomePage);
  router.post("/dangxuat", apiController.logOut);
  router.get("/checkinventory", apiController.checkInventory);
  router.post("/checkinventorystatus", apiController.inventoryStatus);
  router.get(
    "/inventorystatus/:inventoryname/:quantity",
    apiController.checkStatus
  );
  router.post("/addtocart", apiController.addToCart);
  router.post("/deletecart", apiController.deleteCart);
  router.get("/checkout", apiController.checkOut);
  router.post("/payment", apiController.payMent);
  router.get("/checkorder", apiController.getCheckOrder);
  router.post("/deletebill", apiController.deleteBill);
  return app.use("/TMDT", router);
};

// module.exports = router;
export default initApiRoute;
