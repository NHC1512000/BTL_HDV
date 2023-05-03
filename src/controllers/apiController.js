import pool from "../configs/connectDB";

let getSignIn = (req, res) => {
  return res.render("index.ejs");
};

let getSignUp = (req, res) => {
  return res.render("signUp.ejs");
};

let signUpNewUser = async (req, res) => {
  let { username, password } = req.body;
  await pool.execute("insert into user(username, password) values (?, ?)", [
    username,
    password,
  ]);
  return res.redirect("/TMDT/dangnhap");
};

let signInUser = async (req, res) => {
  let { username, password } = req.body;
  const [rows, fields] = await pool.execute(
    "select username, password from `user` where `username`=? and `password` = ?",
    [username, password]
  );
  if (Object.keys(rows).length !== 0) {
    return res.redirect("/TMDT/trangchu");
  } else {
    return res.redirect("/TMDT/dangnhap");
  }
};

let getHomePage = async (req, res) => {
  const [rows, fields] = await pool.execute("select * from `products`");
  const [rows2, fields2] = await pool.execute("select * from `cart`");
  let [sumCart] = await pool.execute(
    "select SUM(quantity) as sumcart from `cart`"
  );
  let [sum] = await pool.execute("select SUM(price) as tong from `cart`");

  return res.render("homePage.ejs", {
    dataProduct: rows,
    dataCart: rows2,
    totalPrice: sum,
    sumCart: sumCart,
  });
};

let logOut = (req, res) => {
  return res.redirect("/TMDT/dangnhap");
};

let checkInventory = async (req, res) => {
  const [rows, fields] = await pool.execute("SELECT * FROM `inventorys` ");
  return res.render("checkInventory.ejs", {
    dataInventory: rows,
  });
};

let inventoryStatus = async (req, res) => {
  let { inventoryname, quantity } = req.body;

  return res.redirect(`/TMDT/inventorystatus/${inventoryname}/${quantity}`);
};

let checkStatus = async (req, res) => {
  let inventoryname1 = req.params.inventoryname;
  let quantity1 = req.params.quantity;
  const [rows, fields] = await pool.execute(
    "select * from `inventorys` where `inventoryname` =? and `quantity` >= ?",
    [inventoryname1, quantity1]
  );
  if (Object.keys(rows).length !== 0) {
    return res.render("inventoryStatus.ejs", {
      nameInven: inventoryname1,
      checkstatus: "Available",
    });
  } else {
    return res.render("inventoryStatus.ejs", {
      nameInven: inventoryname1,
      checkstatus: "Unavailable",
    });
  }
};

let addToCart = async (req, res) => {
  let { name, price, quantity } = req.body;
  let totalPrice = parseInt(price) * parseInt(quantity);
  let total = totalPrice.toString();
  await pool.execute(
    "insert into cart(name, price, quantity) values (?, ?, ?)",
    [name, total, quantity]
  );
  return res.redirect("/TMDT/trangchu");
};

let deleteCart = async (req, res) => {
  let id = req.body.id;
  pool.execute("delete from `cart` where id = ?", [id]);

  return res.redirect("/TMDT/trangchu");
};

let checkOut = async (req, res) => {
  let [sum] = await pool.execute("select SUM(price) as tong from `cart`");
  let [quantity] = await pool.execute(
    "select SUM(quantity) as tongmathang from `cart`"
  );

  return res.render("payMent.ejs", {
    totalPrice: sum,
    totalQuantity: quantity,
  });
};

let payMent = async (req, res) => {
  let {
    name,
    email,
    address,
    phone,
    cardname,
    cardnumber,
    expmonth,
    totalPrices,
    totalQuantitys,
    status,
  } = req.body;

  if (
    Object.keys(name).length !== 0 ||
    Object.keys(email).length !== 0 ||
    Object.keys(address).length !== 0 ||
    Object.keys(phone).length !== 0 ||
    Object.keys(cardname).length !== 0 ||
    Object.keys(cardnumber).length !== 0 ||
    Object.keys(expmonth).length !== 0
  ) {
    await pool.execute(
      "insert into bill(name, email, address, phone, cardname, cardnumber, expmonth, quantity, totalPrice, status) values (?, ?, ?, ?, ?, ?, ? ,? ,? ,?)",
      [
        name,
        email,
        address,
        phone,
        cardname,
        cardnumber,
        expmonth,
        totalQuantitys,
        totalPrices,
        status,
      ]
    );
    await pool.execute("delete from `cart`");

    return res.redirect("/TMDT/trangchu");
  } else {
    return res.redirect("/TMDT/checkout");
  }
};

let getCheckOrder = async (req, res) => {
  let [rows, fields] = await pool.execute("select * from `bill`");

  return res.render("checkOrder.ejs", { dataBill: rows });
};

let deleteBill = async (req, res) => {
  let billId = req.body.id;

  pool.execute("delete from `bill` where id = ?", [billId]);

  return res.redirect("/TMDT/checkorder");
};
module.exports = {
  getSignIn,
  getSignUp,
  signUpNewUser,
  signInUser,
  getHomePage,
  logOut,
  checkInventory,
  inventoryStatus,
  checkStatus,
  addToCart,
  deleteCart,
  payMent,
  getCheckOrder,
  deleteBill,
  checkOut,
};
