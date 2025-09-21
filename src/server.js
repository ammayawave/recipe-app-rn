import express from "express";
import {ENV} from "./config/env.js";
import {db} from "./config/db.js";
import { favorites } from "./db/schema.js";
import { eq, and } from "drizzle-orm";
import job from "./config/cron.js";

const app = express();
const PORT = ENV.PORT || 5001;

if (ENV.NODE_ENV === "production") job.start();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

// get favourite entry 
app.get("/api/favorites/:userId", async (req, res)=>{
    try{
     const { userId} = req.params;
     const userFavorites = await db.select().from(favorites).where(eq(favorites.userId, userId));
     res.status(200).json(userFavorites);
    }catch (error){
        console.log("Error fetching the favorites.", error);
        res.status(500).json({error:"Something went wrong"});
    }
})

// delete favourite entry 
app.delete("/api/favorites/:userId/:recipeId", async (req, res)=>{
    try{
     const { userId, recipeId} = req.params;
     await db
     .delete(favorites)
     .where(
         and(eq(favorites.userId, userId), eq(favorites.recipeId, parseInt(recipeId)))
     )
     res.status(200).json({message: "Favorite removed successfully"});
    }catch (error){
        console.log("Error removing a favorite.", error);
        res.status(500).json({error:"Something went wrong"});
    }
})
// post to favourite 
app.post("/api/favorites", async (req, res)=>{
    try{
     const { userId, recipeId, title, image, cookTime, servings} = req.body;
     if(!userId|| !recipeId || !title ){
        return res.status(400).json({error: "missing required field"});
     }
     const newFavourite = await db.insert(favorites)
     .values({
        userId, 
        recipeId, 
        title, 
        image, 
        cookTime, 
        servings,
     })
     .returning();
     res.status(201).json(newFavourite[0]);x
    }catch (error){
        console.log("Error adding favorite.", error)
        res.status(500).json({error:"Something went wrong"});
    }
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
