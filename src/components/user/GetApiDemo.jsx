import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const GetApiDemo = () => {
    const [users, setusers] = useState([])

    const getUsers = async()=>{

        const res = await axios.get("https://node5.onrender.com/user/user/")
        console.log("response...",res);
        setusers(res.data.data)
    }

    const deleteUser =async(id)=>{
        //alert("delete user called..."+id)
        ///url =de5.onrender.com/user/user/12345678o9p

        const res = await axios.delete(`https://node5.onrender.com/user/user/${id}`)
        console.log(res)
        if(res.status==204){
            toast.success("User deleted successfully")
            getUsers()
            
        }
    }

    //component --> load --> useEffec call --> function call..
    useEffect(()=>{
        //api logic..
        getUsers()
    },[])
  return (
    <div style={{textAlign:"center"}}>
        <h1>GET API DEMO</h1>
        {/* <button onClick={getUsers}>Get Users</button> */}
        {/* tailwind classes for table */}
        <table className='table table-bordered table-hover table-striped'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>  
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user)=>(
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                            <button onClick={()=>{deleteUser(user._id)}} className='text-red-500 cursor-pointer font-bold'>DELETE</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}
