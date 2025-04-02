const express=require("express")
const router=express.Router()
const cartController=require("../controllers/cart")

// post a book
router.post("/",cartController.postCart)

// get all cart
router.get("/:userId",cartController.getCart)



// get a particular book
// router.get("/:id",cartController.getOneBook)

// update a particular book
// router.patch("/:id",cartController.updateOneBook)


// delete a particular book
// router.delete("/:id",cartController.deleteOneBook)



module.exports=router
