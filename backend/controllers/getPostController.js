import { provider } from "../config/ethers.js";
import { ethers } from "ethers";
import MyBlogAbi from "../../blockchain/build/contracts/MyBlogApp.json" with { type: "json" };
import dotenv from "dotenv";

dotenv.config();

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, MyBlogAbi.abi, provider);


export const getPostsbyUsers = async(req,res) =>
{
    const { user_address }=req.body;

    if(!user_address) return res.status(400).json({ message: "A Wallet Address is required" });

    try 
    {
        const userposts=await contract.getAllPostsOfUser(user_address);
        // console.log(userposts);
        // console.log(userposts.length);
        return userposts;
    } 
    catch (error) {
        console.log("Error fetching User's Posts:",error)
    }
}

getPostsbyUsers();