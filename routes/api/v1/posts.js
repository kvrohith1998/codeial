const express = require('express');

const router = express.Router();
const postApi = require("../../../controllers/api/v1/post_api");

router.get('/', postApi.index);
router.delete('/:id', postApi.destroy);

module.exports = router;