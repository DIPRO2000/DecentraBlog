import express from "express";
import { getPostsbyUsers, getAllPosts } from "../controllers/getPostController.js";

const router=express.Router()

router.post("/getpostofuser",getPostsbyUsers); 
router.get("/getallpost",getAllPosts);

export default router; 