const express=require("express")
const router=express.Router()
const booksController=require("../controllers/books")

// get all books
router.get("/",booksController.getAllBooks)

// post a book
router.post("/",booksController.postBook)

// get a particular book
router.get("/:id",booksController.getOneBook)

// update a particular book
router.patch("/:id",booksController.updateOneBook)


// delete a particular book
router.delete("/:id",booksController.deleteOneBook)



module.exports=router
