import axios from 'axios'
import React, { useEffect } from 'react'

export const ProductList = () => {
    const getAllProducts = async()=>{
        const token = localStorage.getItem("token")
        const res = await axios.get("/product/products",{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        })
        console.log(res)
    }
    useEffect(()=>{
        getAllProducts()
    },[])
  return (
    <div>ProductList</div>
  )
}
