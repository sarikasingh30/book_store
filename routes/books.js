const express=require("express")
const router=express.Router()
const booksController=require("../controllers/books")

// get all books
router.get("/",booksController.getAllBooks)

// post a book
router.post("/",booksController.postABook)

// get a particular book
router.get("/:id",booksController.getABook)

// update a particular book
router.patch("/:id",booksController.updateABook)


// delete a particular book
router.delete("/:id",booksController.deleteABook)



module.exports=router
