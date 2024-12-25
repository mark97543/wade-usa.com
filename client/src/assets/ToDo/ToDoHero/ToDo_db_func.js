import axios from "axios";
import React, { useState, useEffect, createContext }from 'react'
/* ----- Purpose of this file is to handle all database requests/updates ---- */

const fetchTodos = async (setToDos) => {
    try {
        const response = await axios.get('/todos');
        console.log("Response from API:", response.data)
        setToDos(response.data);
    } catch (error) {
        console.error('Error fetching todos:', error);
    } 
    
};

export {fetchTodos}