import React, { useState, useCallback } from 'react';

import useStore from './useStore';

const { admin, url } = useStore();


  export async function getAllStores(userId) {

    try
    {
      const resp = await fetch(`${url}/getAllStores?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

        const data = await resp.json();
        console.log("all stores ----------------",data);
        //setAllStores(data);
        return data;

    }
    catch(e)
    {
      console.log(e);
    }

  }