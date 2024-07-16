"use client"
import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, TextField, Switch, Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { Edit } from "@mui/icons-material";

import AuthService from "../../services/AuthService";
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function Users() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        login_before_date: '',
        login_after_date: '',
        active: true
    });

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = async () => {
        try {
            const data = await AuthService.getUsers();
            filterUsersByDate(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const filterUsersByDate = (data) => {
        
        const filteredUsers = data.filter(user => {
            
            const createdAt = new Date(user.createdAt);
            const loginBefore = filters.login_before_date ? new Date(filters.login_before_date) : null;
            const loginAfter = filters.login_after_date ? new Date(filters.login_after_date) : null;

            if (loginBefore && createdAt >= loginBefore) {
                return false;
            }
            if (loginAfter && createdAt <= loginAfter) {
                return false;
            }
            return true;
        });

        setUsers(filteredUsers.filter(user => user.status === filters.active));
    };

    const handleEdit = (user) => {
        router.push('/users/' + user.id + '/edit');
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFilters({
            ...filters,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSearch = async () => {
        try {
            const data = await AuthService.findUsers(filters);
            filterUsersByDate(data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    return (
        <Container>
            <Navbar />
            <h1>Usarios</h1>
            <h3>Busqueda</h3>
            <div>
                <TextField
                    label="Name"
                    name="name"
                    variant="outlined"
                    value={filters.name}
                    onChange={handleChange}
                />
                <TextField
                    label="Login Before"
                    name="login_before_date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.login_before_date}
                    onChange={handleChange}
                />
                <TextField
                    label="Login After"
                    name="login_after_date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.login_after_date}
                    onChange={handleChange}
                />
                <label style={{ marginRight: '10px' }}>Estado</label>
                <Switch
                    name="active"
                    checked={filters.active}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'Mostrar usuarios activos' }}
                />
                <Button variant="contained" onClick={handleSearch}>Search</Button>
            </div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Última Sesión</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.status ? 'ACTIVO' : 'CERRADO'}</TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" aria-label={"Editar usuario " + user.name} onClick={() => handleEdit(user)}>
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </Container>
    );
}
