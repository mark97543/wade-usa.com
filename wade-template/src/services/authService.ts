/**
 * 🔑 SERVICE: Auth
 * Handles login, logout, and fetching user permissions.
 * /src/services/authService.ts
 */

import client from "./directus";
import { readMe, registerUser } from "@directus/sdk";

export const authService ={
    //1.Standard login
    async login(email:string, pass:string){
        try{
            const authData = await client.login({ email, password: pass });
            console.log("1. Login Success, Token Received:", authData);
            const user = await this.getCurrentUser();
            console.log("2. User Profile Fetched:", user);
            return user;
        }catch(error){
            throw new Error("Login Fails. Check your credentials.");
        }
    },
    //2, Fetch user profile and Role (level check)
    async getCurrentUser(){
        try{
            // readMe() is a special Directus function that returns the current logged-in user
            const user = await client.request(readMe({
                fields:['*']
            }));
            return user;
        }catch(error){
            return null;
        }
    },
    //3.logout
    async logout(){
        await client.logout();
        //window.location.href = '/login'; //Redirect to the clear app state 
    },
    //4. New User Registration
    async register(email:string, pass:string, firstName:string){
        try{
            await client.request(registerUser(email, pass, {
                first_name:firstName,
            }));
            return {success:true};
        }catch(error:any){
          console.error("Registration Error: ", error);
          throw new Error(error.errors?.[0]?.message || "Registration Failed");
        }
    }
}