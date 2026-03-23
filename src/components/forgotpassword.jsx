import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export const Forgotpassword = () => {
    const {register,handleSubmit,formState:{errors}}=useForm()
    const navigate = useNavigate()

    const submitHandler = async(data)=>{
        console.log(data)
        const res = await axios.post("/user/forgotpassword",data)
        console.log(res.data)
        if(res.status==200){
            navigate("/")
        }
    }
  return (
    <div>
        <h1>FORGOT PASSWORD</h1>
        <form onSubmit={handleSubmit(submitHandler)}>
            <input type="email" placeholder="Email" {...register("email",{
                required:"Email is required"
            })}/>
            {errors.email && <p>{errors.email.message}</p>}
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}
