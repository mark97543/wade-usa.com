import React, {useState} from 'react'
import directusClient from '../../../client/src/lib/directus';
import { readItems } from '@directus/sdk';

function db_pull(setLoading, COLLECTION_NAME, setPosts, setError) {
    async function fetchPosts(){
        setLoading(true)
        try{
            const fetchedPosts = await directusClient.request(
                readItems(COLLECTION_NAME, {
                    feilds:[
                        'title',
                        'slug',
                        'status',
                        'update',
                        'summary',
                        'id',
                        'content',
                    ],
                    filter:{
                        status:{_eq:'deploy'}
                    },
                    sort:['title']
                })
            )
            setPosts(fetchedPosts)
            setError(null)
        }catch(err){
            console.error(`Failed to fetch items from ${COLLECTION_NAME}:`, err);
            setError(`Failed to load items. Please try again later. Error: ${err.message}`);
        }finally{
            setLoading(false)
        }
    }
    fetchPosts();
}

export default db_pull

