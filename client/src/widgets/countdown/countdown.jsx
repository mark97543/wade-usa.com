// /client/src/widgets/countdown/countdown.jsx

import React, {useState, useEffect} from "react";
import './coundown.css'

//Use the envirenmental variable provided by vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Will be 'http://localhost:5000/api' in dev, '/api' in prod
const API_LOGIN_URL = `${API_BASE_URL}/countdown/`; // The '/auth/login' part is consistent


const Countdown = () =>{

    const [countdown, setCountdown]=useState([ ])
    const [addItem, setAddItem]=useState(true)
    const [addTitle, setAddTitle]=useState('')
    const [addDate, setAddDate]=useState('')
    const [timer, setTimer]=useState('')

    //Countdown Mechanics
    useEffect(()=>{
        
        const countDownCalc = ()=>{
            const now = new Date()

            setCountdown(prevCountDownItems=>
                prevCountDownItems.map(item=>{
                    //May need logic here if dont want negative items
                    const ecd = new Date(item.date)
                    let timeTill = ecd - now
                    
                    //If Count Down is Ended this will cancel and go to next
                    if (timeTill <= 0) {
                        // Countdown has finished for this item
                        return {
                            ...item,
                            timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
                        };
                    }

                    const d = Math.floor(timeTill /(1000*60*60*24))
                    const h = Math.floor((timeTill % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const m = Math.floor((timeTill%(1000*60*60))/(1000*60))
                    const s = Math.floor((timeTill % (1000 * 60)) / 1000);
                    //console.log(`Formatted Countdown: ${d}d : ${h}h : ${m}m : ${s}s`);
                    return{
                        ...item, //Keep all existing items
                        timeLeft: {days: d, hours: h, minutes: m, seconds: s}
                    }

            }))
           
        }
        
        //Ste up interval
        // setInterval calls actionToRepeat every 1000 milliseconds (1 second)
        // It returns an interval ID which we need to clear it later.
        const intervalId = setInterval(countDownCalc, 1000)

        //cleanup function
        // It runs when the component is about to unmount.
        // It's crucial for preventing memory leaks by clearing the interval.0
        return ()=>{
            clearInterval(intervalId)//Clear interval useing its ID
        }
    }, [])
 
    //Pull countdowns from database
    const pullCountdowns = async()=>{
        try{
            const response = await fetch(API_LOGIN_URL, {
                method: 'GET',
                headers: {
                    'Accept':'application/json',
                },
            })
            const data = await response.json() //parse the JSON response from the backend
            const data2 = data.map(item=>({...item, id: parseInt(item.id, 10), isEditing:false, timeLeft:{days:0, hours: 0, minutes: 0, seconds:0}}))
            setCountdown(data2)

        }catch(error){
            console.error('No Response from the Server: ', error)
        }
    }

    //Function to Add new countdown to DB
    const addCountdown = async (newItem)=>{
        try{
            const response = await fetch(`${API_LOGIN_URL}/add`,{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':'application/json',
                },
                body: JSON.stringify(newItem)
            })
            const data = await response.json() //parse the JSON response from the backend
            const data2 = data.map(item=>({...item, id: parseInt(item.id, 10), isEditing:false, timeLeft:{days:0, hours: 0, minutes: 0, seconds:0}}))
            setCountdown(data2)
       }catch(error){
            console.error('Error with add on the client side: ', error)
       }
    }


    //Fetch Data from Server
    useEffect(()=>{
        //console.log("Use Effect Initiated")
        pullCountdowns()

    }, [])

    //On a double click changes to edit mode for the item. 
    const editMode = (e) =>{

        const itemId = parseInt(e)

        setCountdown(prevItems =>
            prevItems.map(item =>
            item.id === itemId
                ? { ...item, isEditing: true } // If IDs match, create a new item with isEditingTitle: true
                : item
            )                             // Otherwise, keep the original item unchanged
        )

    }

    //Cancels the Edit mode

    const cancelEditMode = (e)=>{
        const itemId = parseInt(e)

        setCountdown(prevItems =>
        prevItems.map(item =>
        item.id === itemId
            ? { ...item, isEditing: false } // If IDs match, create a new item with isEditingTitle: true
            : item
        )                             // Otherwise, keep the original item unchanged
        )

        pullCountdowns()
    }

    // This allows the Item to be edited and checks if the condition is set for it to be edited. 
    const editTitle = (e) =>{

        const itemId = parseInt(e.target.id)
        const newTitle = e.target.value

        setCountdown(prevItems =>
            prevItems.map(item =>{
                if(item.id === itemId){
                    return {...item, title:newTitle}
                }else{
                    return item
                }

            })
        )
    }

    //This allows the date to be edited and checks f condition is set for it to be edited
    const editDate =(e)=>{
        const itemId = parseInt(e.target.id)
        const newDate = e.target.value

            setCountdown(prevItems =>
                prevItems.map(item =>{
                    if(item.id === itemId){
                        return {...item, date:newDate}
                    }else{
                        return item
                    }

                })
            )
        
    }

    //Function to set add new Item mode
    const addItemMode = ()=>{
        setAddItem(!addItem)

        
        //Clears Boxes
        setAddTitle("")
        setAddDate("")
    }

    //This will be the save Item Function
    const saveCountdown = () =>{

        //Error Message if title or date is null
        if(!addTitle){
            //console.log("Error Title Cannot Be Blank")
            alert("Error: You cannot havea a blank title!")
            return
        }else if (!addDate){
            alert('Error: You cannot have a date value of Null!')
            return
        }

        //find the next avaiable ID and Make new array
        let newId = 0;

        if (!countdown || countdown.length === 0){
            newId = 1
        }else{
            newId = Math.max(...countdown.map(item=>item.id))+1
        } 

       const newItem = {
            id: newId,
            title: addTitle,
            date: addDate,
            isEditing: false,
       }

       addCountdown(newItem)
       
        // setCountdown(prevItems =>{
        //         return [...prevItems, newItem]
        // })

        //Clears Boxes
        setAddTitle('')
        setAddDate("")

        //Closes the add Item
        addItemMode()
    }

    //This will Delete a countdown
    const deleteCountDownItem = async(id)=>{
        id = parseInt(id, 10)
        const idToDelete = {id}

        try{
            const response = await fetch(`${API_LOGIN_URL}/delete`,{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':'application/json',
                },
                body: JSON.stringify(idToDelete)
            })
            const data = await response.json() //parse the JSON response from the backend
            const data2 = data.map(item=>({...item, id: parseInt(item.id, 10), isEditing:false, timeLeft:{days:0, hours: 0, minutes: 0, seconds:0}}))
            setCountdown(data2)

        }catch(error){
            console.error('Error with deleteCountdown function in countdown.js: ', error)
        }


        // setCountdown(precItems=>
        //     precItems.filter(item => item.id !== idToDelete)
        // )
    }

    //This will Save Edits
    const saveEdits = async(id, title, date)=>{
        const send = {id, title, date}
        
        try{
            const response = await fetch(`${API_LOGIN_URL}/edit`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Accept':'application/json',
                },
                body:JSON.stringify(send)
            })
            const data = await response.json() //parse the JSON response from the backend
            const data2 = data.map(item=>({...item, id: parseInt(item.id, 10), isEditing:false, timeLeft:{days:0, hours: 0, minutes: 0, seconds:0}}))
            setCountdown(data2)
        }catch(error){
            console.error('Error with saveEdits function in countDonw.js: ', error)
        }
    }

    return(
        <div className="countdown-box">
            {/* Mapping Function to dynamically build the clocks*/}
            {countdown?.map((item)=>{
                return(
                    <div key={item.id} className="countdown-clocks">
                        <label className="form-label mt-4 countdown-event-label" htmlFor="countdown-title">Event:</label>

                        <input 
                            className={`form-control countdown-title ${!item.isEditing ? 'countdown-title-spanAll':''}`} 
                            id={item.id} 
                            type="text" 
                            value={item.title}
                            readOnly={!item.isEditing}
                            onDoubleClick={(e)=>(editMode(e.target.id))}
                            onChange={(e)=>{editTitle(e)}}
                            >
                        </input>

                        <label className="form-label mt-4 countdown-date-label" htmlFor="countdown-date">Date:</label>
                        <input
                            className={`form-control countdown-date ${!item.isEditing ? 'countdown-date-spanAll':''}`}
                            id={item.id}
                            type="datetime-local"
                            value={item.date}
                            readOnly={!item.isEditing}
                            onChange={(e)=>{editDate(e)}}
                            onDoubleClick={(e)=>editMode(e.target.id)}
                        ></input>
                        <label className="form-label mt-4 countdown-timer-label" hidden={item.isEditing} htmlFor="countdown-timer">ECD:</label>
                        <input
                            className={`form-control countdown-timer ${!item.isEditing ? 'countdown-timer-spanAll':''}`}
                            id={item.id}
                            type="text"
                            readOnly={true}
                            value={`${item.timeLeft.days} D:${item.timeLeft.hours} H:${item.timeLeft.minutes} M:${item.timeLeft.seconds} S`}
                            hidden={item.isEditing}
                        ></input>
                        {/*console.log(item.timeLeft)*/}
                        <button className="btn btn-success countdown-editSave" hidden={!item.isEditing} onClick={()=>saveEdits(item.id, item.title, item.date)}>💾</button>
                        <button id={item.id} className="btn btn-danger countdown-cancelEdit" onClick={()=>cancelEditMode(item.id)} hidden={!item.isEditing}>❌</button>
                        <button className="btn btn-danger countdown-delete" hidden={!item.isEditing} onClick={()=>deleteCountDownItem(item.id)}>Delete</button>
                        
                    </div>
                )
            })}
            {/*Add new timer form */}
            <div className="countdown-addItem">

                <p className="countdown-instructions1" hidden={!addItem}>1. Add New Countdown</p>
                <p className="countdown-instructions2" hidden={!addItem}>2. Double Click Item To Edit It</p>
                <button type="button" className="btn btn-success countdown-addButton" hidden={!addItem} onClick={addItemMode}>✏️</button>

                <input type="text" className="form-control countdown-new-itemTitle" placeholder="New Title" id="inputDefault" hidden={addItem} value={addTitle} onChange={(e)=>setAddTitle(e.target.value)}></input>
                <input type="datetime-local" className="form-control" placeholder="New Time and Date" id="inputDefault" value={addDate} onChange={(e)=>setAddDate(e.target.value)} hidden={addItem}></input>
                <button type="button" className="btn btn-success countdown-addButton" hidden={addItem} onClick={saveCountdown}>💾</button>
                <button type="button" className="btn btn-danger countdown-addButton-Cancel" onClick={addItemMode} hidden={addItem}>❌</button>


            </div>
        </div>
    )
}

export default Countdown;


//TODO's:
//6. Need to set up actual countdown functions (Ticker may be with a use effect on a MS timer)


