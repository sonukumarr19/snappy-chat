const { addMessages, getAllMessages } = require("../controllers/messageController");

const router = require("express").Router();

router.post("/addmsg",addMessages)
router.post("/getmsg",getAllMessages)

module.exports = router;