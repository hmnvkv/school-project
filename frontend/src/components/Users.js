import React, { useState, useEffect } from 'react'

const API = process.env.REACT_APP_API;

export const Users = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [editing, setEditing] = useState(false)
    const [id, setID] = useState('')

    const [users, setUsers] = useState([])

    /* Función crear */
    const handleSubmit = async (e) => {
        /* Evitamos el refresco de la página al dar clic en un botón */
        e.preventDefault();
        
        if (!editing)
        {
            const res = await fetch(`${API}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                }) 
            })
            const data = await res.json();
            console.log(data);
        }
        else
        {
            const res = await fetch(`${API}/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })
            const data = await res.json();
            console.log(data);
            setEditing(false);
            setID('')
        }

        await getUsers();

        setName('');
        setEmail('');
        setPassword('');
    }

    /* Función para obtener usuarios */
    const getUsers = async () => {
        const res = await fetch(`${API}/users`)
        const data = await res.json();
        setUsers(data)
    }

    /* Ejecutamos la función getUsers al arranque de la app */
    useEffect(() => {
        getUsers();
    }, [])

    /* Función de Borrar Usuarios */
    const deleteUser = async (id) => {
        const userResponse = window.confirm('¿Estás seguro de borrar?')
        if (userResponse) 
        {
            const res = await fetch(`${API}/users/${id}`, {
                method: 'DELETE'
            });
            await res.json();
            await getUsers()
        }

    }

    /* Función de Editar Usuarios */
    const updateUser = async (id) => {
        const res = await fetch(`${API}/users/${id}`)
        const data = await res.json();

        setEditing(true);
        setID(id)

        setName(data.name)
        setEmail(data.email)
        setPassword(data.password)
    }

    /* Todo el HTML que devuelve el JSX */
    return(
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    <div className="form-group">
                        <input 
                            type="text" 
                            onChange={ e => setName(e.target.value) } 
                            value={ name } 
                            className="form-control"
                            placeholder="Name"
                            autoFocus
                        />
                        <br/> 
                        <input 
                            type="email" 
                            onChange={ e => setEmail(e.target.value) } 
                            value={ email } 
                            className="form-control"
                            placeholder="Email"
                        /> 
                        <br/>
                        <input 
                            type="Password" 
                            onChange={ e => setPassword(e.target.value) } 
                            value={ password } 
                            className="form-control"
                            placeholder="Password"
                        /> 
                        <br/>
                    </div>
                    <button className="btn btn-primary btn-block"> {editing ? 'Update' : 'Create'} </button>
                </form>
            </div>
            <div className="col-md-6">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>
                                    <button 
                                        className="btn btn-secondary btn-sm btn-block"
                                        onClick={e => updateUser(user._id)}
                                        >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-sm btn-block"
                                        onClick={() => deleteUser(user._id)}
                                        >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}