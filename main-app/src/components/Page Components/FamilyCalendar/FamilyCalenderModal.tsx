import React, {useState, useEffect} from 'react'
import { Modal } from '../../BaseComponents/Modal/Modal'
import Button from '../../BaseComponents/Button';
import styles from './FamilyCalendar.module.css'
import Input from '../../BaseComponents/Input/Input';
import { Checkbox } from '../../BaseComponents/Checkbox/Checkbox';
import { formatToDateTimeLocal } from './FamilyCalenderFunc';
import { saveEventToDirectus } from './FamilyCalenderFunc';
import { deleteEvent, updateEvent } from './FamilyCalenderFunc';

interface ModalEdit{
    isOpen:boolean;
    onClose: ()=>void;
    title:string;
    modalType:'edit'|'new';
    item:any;
    setRefresh:React.Dispatch<React.SetStateAction<boolean>>;
}

function FamilyCalenderModal({isOpen, onClose, title, modalType, item, setRefresh}:ModalEdit) {
    const [eventTitle, setEventTitle]=useState('')
    const [startDate, setStartDate]=useState('')
    const [endDate, setEndDate]=useState('')
    const [eventColor, setEventColor]=useState("#3788d8")
    const [description,setDescription]=useState('')
    const [allDay, setAllDay]=useState(false)
    const [id, setId]=useState('')


    useEffect(() => {
        if (isOpen && item) {
            // This is the line that actually puts the title into the input box
            setEventTitle(item.title || "");
            
            // Sync date too while we are at it
            const rawDate = item.start;
            setStartDate(rawDate ? formatToDateTimeLocal(rawDate) : "");
            const rawEnd = item.end;
            setEndDate(rawEnd? formatToDateTimeLocal(rawEnd):'');
            setEventColor(item.color || "#3788d8");
            setDescription(item.description || "");
            setAllDay(item.allDay || false)
            setId(item.id || '')
        }
    }, [isOpen, item]);

    const save = async ()=>{
        const dataToSend={
            title: eventTitle,
            start: startDate,
            end: endDate,
            description: description,
            color: eventColor,
            allDay: allDay,
            id:id
        }

        if(modalType==='new'){
            await saveEventToDirectus(dataToSend);
        }else{
            await updateEvent(dataToSend)
        }
        //Need to Post Data. 
        setRefresh(prev=>!prev);
        onClose();
    }

    const deleteEventItem = async ()=>{
        const confirm = window.confirm("Are you sure you want to delete this event? ");
        if(confirm){
            await deleteEvent(Number(id));
            setRefresh(prev=>!prev);
            onClose();
        }
    }

    const allDayChange=()=>{
        //console.log('From Modal: ',allDay)
        setAllDay(!allDay)
        setEndDate(startDate)
    }
    
  return (
    <div>
        <Modal isOpen={isOpen} title={title} onClose={onClose}>
            <div>
                <div>
                    {modalType==='edit' ? (
                        <div>
                            <div>
                                <Input 
                                    value={eventTitle}
                                    placeholder='Event Title'
                                    onChange={(e)=>setEventTitle(e.target.value)}
                                />
                                <Input
                                    type='datetime-local'
                                    value={startDate}
                                    placeholder='Start Date'
                                    onChange={(e)=>setStartDate(e.target.value)}
                                    label='Start Date'
                                />
                                <Input
                                    type='datetime-local'
                                    placeholder='End Date'
                                    label='End Date'
                                    value={endDate}
                                    onChange={(e)=>setEndDate(e.target.value)}
                                />
                                <Input
                                    type='color'
                                    value={eventColor}
                                    onChange={(e)=>setEventColor(e.target.value)}
                                    placeholder='Event Color'
                                    style={{ 
                                        height: '45px',    // Ensure it's tall enough
                                        padding: '2px',    // Padding often "hides" the color swatch
                                        cursor: 'pointer'
                                    }}
                                />
                                <Checkbox
                                    label='All Day'
                                    id='all_day'
                                    checked={allDay}
                                    style={{
                                        marginBottom:'20px'
                                    }}
                                    onChange={allDayChange}
                                />
                                { /*TODO: Add value and change Event to this  */}
                                <Input
                                    renderAs='textarea'
                                    placeholder='Description'
                                    style={{
                                        resize:'none',
                                        minHeight:'6rem'
                                    }}
                                    value={description}
                                    onChange={(e)=>setDescription(e.target.value)}
                                />
                            </div>
                            <div className={styles.CAL_EDIT_MODAL_BUTTONS}>
                                <Button style={{width:'100%'}} onClick={save}>Save</Button>
                                <Button style={{width:'100%'}} type='neutral' onClick={onClose}>Cancel</Button> 
                                <Button style={{width:'100%'}} onClick={deleteEventItem} type='danger'>🗑️</Button>
                            </div>
                        </div>
                    ):(
                        <div>
                            <div>
                                <Input 
                                    placeholder='Event Title'
                                    value={eventTitle}
                                    onChange={(e)=>setEventTitle(e.target.value)}
                                />
                                <Input
                                    type='datetime-local'
                                    value={startDate}
                                    placeholder='Start Date'
                                    onChange={(e)=>setStartDate(e.target.value)}
                                    label='Start Date'
                                />
                                <Input
                                    type='datetime-local'
                                    placeholder='End Date'
                                    label='End Date'
                                    value={endDate}
                                    onChange={(e)=>setEndDate(e.target.value)}
                                />
                                <Input
                                    type='color'
                                    value={eventColor}
                                    onChange={(e)=>setEventColor(e.target.value)}
                                    placeholder='Event Color'
                                    style={{ 
                                        height: '45px',    // Ensure it's tall enough
                                        padding: '2px',    // Padding often "hides" the color swatch
                                        cursor: 'pointer'
                                    }}
                                />
                                <Checkbox
                                    label='All Day'
                                    id='all_day'
                                    checked={allDay}
                                    style={{
                                        marginBottom:'20px'
                                    }}
                                    onChange={allDayChange}
                                />
                                <Input
                                    renderAs='textarea'
                                    placeholder='Description'
                                    style={{
                                        resize:'none',
                                        minHeight:'6rem'
                                    }}
                                    value={description}
                                    onChange={(e)=>setDescription(e.target.value)}
                                />

                                {/*TODO: Add Color, and Checkbox to this  */}
                            </div>
                            <div className={styles.CAL_NEW_MODAL_BUTTONS}>
                                <Button style={{width:'100%'}} onClick={save}>Save</Button>
                                <Button style={{width:'100%'}} type='neutral' onClick={onClose}>Cancel</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    </div>
  )
}

export default FamilyCalenderModal

