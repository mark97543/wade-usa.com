import React, {useState, useEffect} from 'react'
import { Modal } from '../../BaseComponents/Modal/Modal'
import Button from '../../BaseComponents/Button';
import styles from './FamilyCalendar.module.css'
import Input from '../../BaseComponents/Input/Input';
import { Checkbox } from '../../BaseComponents/Checkbox/Checkbox';

interface ModalEdit{
    isOpen:boolean;
    onClose: ()=>void;
    title:string;
    modalType:'edit'|'new';
    item:any;
}

function FamilyCalenderModal({isOpen, onClose, title, modalType, item}:ModalEdit) {
    const [eventTitle, setEventTitle]=useState('')
    const [startDate, setStartDate]=useState('')
    const [endDate, setEndDate]=useState('')
    const [eventColor, setEventColor]=useState("#3788d8")


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
        }
    }, [isOpen, item]);
    
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
                                    style={{
                                        marginBottom:'20px'
                                    }}
                                />

                            </div>
                            <div className={styles.CAL_EDIT_MODAL_BUTTONS}>
                                <Button style={{width:'100%'}}>Save</Button>
                                <Button style={{width:'100%'}} type='neutral'>Cancel</Button> 
                                <Button style={{width:'100%'}} type='danger'>🗑️</Button>
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
                            </div>
                            <div className={styles.CAL_NEW_MODAL_BUTTONS}>
                                <Button style={{width:'100%'}}>Save</Button>
                                <Button style={{width:'100%'}} type='neutral'>Cancel</Button>
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

const formatToDateTimeLocal = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    // This adjusts the time to your local timezone and formats it correctly
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};