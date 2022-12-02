const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET }=process.env;
const { getCartByUser, getCartItemsByCart,getCartById,addProductToCartItems, getCartItemById, destroyCartItem, createCart,getIdByUsername } = require("../db");
const { getAllUsers, getUser, getUserByUsername, createUser, updateUser, getUserById} = require("../db/users");
const { requireUser } = require("./utils");

usersRouter.use("/", (req, res, next) => {
  next();
});

usersRouter.get("/", async (req, res) => {

  const users = await getAllUsers();

  res.send({
    users,
  });
});

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
    const { username, password} = req.body;
    try {
      const user = await getUser({ username, password});
  
      if (user) {
        const token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });
        res.send({
          token,
          user,
          message: "you're logged in!",
        });
      } else {
        next({
          name: "IncorrectCredentialsError",
          message: "Username or password is incorrect",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
    const { username, password, is_admin, email } = req.body;
    try {
      const user = await getUserByUsername(username);
  
      if (password.length < 8) {
        next({
          error: "Password too short",
          message: "Password Too Short!",
          name: "Password too short",
        });
      }
  
      if (user) {
        next({
          name: "UserExistsError",
          message: `User ${username} is already taken.`,
        });
      } 
      // else {
      
        const newUser = await createUser({
          username,
          password,
          is_admin,
          email,
        });
  
        const token = jwt.sign(newUser, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });
        res.send({
          message: "thank you for signing up",
          token,
          user: newUser,
        });
        // }
        let userId = await getIdByUsername(username)
        let isActive = true
        createCart(userId, isActive )
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  usersRouter.get("/me", async (req, res, next) => {
    try {
      if (req.user) {
        res.send(req.user);
      } else {
        next({
          error: "Unauthorized",
          name: "Invalid credentials",
          message: "You must be logged in to perform this action",
        });
      }
    } catch (err) {
      console.log(err.message);
      next();
    }
  });

  usersRouter.get('/mycart', requireUser, async (req, res, next) => {
    const  userId  = req.user.id;
   console.log(req.user.id, "REQ,USER ID")
    try {
        const userCart = await getCartByUser(userId)
        console.log(userCart, "USER CART")
        if (req.user){
        res.send(
            userCart,
        )}
    } catch ({ name, message }) {
        next ({ name, message })
    }
  })


  usersRouter.get('/mycart/cart_items', requireUser, async (req, res, next) => {
    const  userId  = req.user.id;
  
    try {
        
        
        const cartItemsList = (
          await getCartItemsByCart(userId)
        ).map((cartItem) => cartItem);
       
       console.log(cartItemsList, "A LIST OF CART ITEMS MILORD")
  
        if (req.user){
        res.send(
            cartItemsList,
        )}
    } catch ({ name, message }) {
        next ({ name, message })
    }
  })

  usersRouter.post("/mycart/cart_items", requireUser,
  
    async (req, res, next) => {
    try {
        const cartId = req.user.id;
      const originalCart = await getCartById(cartId);
        
      if (originalCart) {
         {
            console.log(req.body, "REQ.BODY");
            
          const { productId, price, quantity } = req.body;


        const updatedCartItems = await addProductToCartItems({
            productId, cartId, price, quantity
            });
  
            res.send(updatedCartItems);
          }
        } 
    } catch (error) {
    console.log(error)
    }
    }
  );

  usersRouter.delete("/mycart/cart_items/:cartItemId", requireUser, async (req, res, next) => {
    try {
      const cartItem = await getCartItemById(req.params.cartItemId);
      console.log(cartItem, "THIS IS CART ITEM DELETE");
      const deletedCartItem = await destroyCartItem(cartItem.id);
          res.send(deletedCartItem);
      
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  usersRouter.patch("/me/:userId", requireUser, async (req, res, next) => {
    const { userId } = req.params;
    const fields = req.body;
    console.log(fields)
    if (req.body) {
      try {
        const originalUser = await getUserById(userId);
    
  
        if (originalUser) {
          const updatedUser = await updateUser({
            id: userId,
            ...fields,
          });
          res.send(updatedUser);
        } else {
          next({
            name: "user does not exist",
            message: `user ${userId} not found`,
            error: "error",
          });
        }
      } catch ({ name, message, error }) {
        next({ name, message, error });
      }
    } else {
      next({
        name: "There is no req.body",
        message: "We need a body",
        error: "error",
      });
    }
  });

module.exports = usersRouter;
