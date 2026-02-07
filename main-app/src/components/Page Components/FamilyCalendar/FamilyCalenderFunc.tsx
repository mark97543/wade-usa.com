import client from "../../../lib/directus";
import { createItem, deleteItem, updateItem } from "@directus/sdk";

export const formatToDateTimeLocal = (dateString: string | Date) => {
    if (!dateString) return '';
    
    // Check if it's a date-only string (e.g., "2026-02-06")
    // If it is, we replace the dashes with slashes or add a time 
    // to force JS to treat it as local time.
    let date: Date;
    if (typeof dateString === 'string' && dateString.length === 10) {
        // Option A: Replace dashes with slashes (Forces local interpretation in most browsers)
        // Option B: Append 'T00:00'
        date = new Date(dateString.replace(/-/g, '\/')); 
    } else {
        date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const saveEventToDirectus = async (eventData: any) => {
    // The 'customStorage' you wrote handles the Bearer token automatically.
    
    return await client.request(
        createItem('events', {
            title: eventData.title,
            start: eventData.start,
            end: eventData.end,
            description: eventData.description,
            color: eventData.color,
            allDay: eventData.allDay
        })
    );
};

export const deleteEvent = async (eventData:number)=>{
    return await client.request(
        deleteItem('events',eventData)
    )
}

export const updateEvent = async (eventData:any)=>{
    return await client.request(
        updateItem('events',eventData.id,{
            title: eventData.title,
            start: eventData.start,
            end: eventData.end,
            description: eventData.description,
            color: eventData.color,
            allDay: eventData.allDay
        })
    )
}