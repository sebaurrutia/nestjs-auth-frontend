"use client"
import React, { useState } from "react";
import { Card, CardContent, Container, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import SimpleSnackbar from "@/components/SimpleSnackbar";
import AuthService from "@/services/AuthService";

import './page.css';

const Register = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_second, setPasswordSecond] = useState("");
    const [cellphone, setCellphone] = useState("");
    const [message, setMessage] = useState("");
    const [openSnack, setOpenSnack] = useState(false);

    const handleAddUser = () => {
        if (password !== password_second) {
            setMessage("Las contraseñas no coinciden");
            setOpenSnack(true);
            return;
        }
        const newUser = { name, email, password,password_second,cellphone };
        setUsers([...users, newUser]);
        setName("");
        setEmail("");
        setPassword("");
        setPasswordSecond("");
        setCellphone("");
    };

    const handleRegisterAll = async () => {
        try {
            const response = await AuthService.bulkCreate(users);
            setMessage(response.message);
        } catch (error) {
            setMessage("Error al conectar con el servidor");
        } finally {
            setOpenSnack(true);
        }
    };
    
    return (
        <Container>
            <SimpleSnackbar message={message} openSnack={openSnack} closeSnack={() => setOpenSnack(false)} />
            <Card className="form">
                <CardContent>
                    <h1>Registro de Usuarios</h1>
                    <div className="input-form">
                        <TextField
                            id="outlined-basic-name"
                            label="Nombre"
                            variant="outlined"
                            required
                            placeholder="Ingrese el nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="input-form">
                        <TextField
                            id="outlined-basic-email"
                            label="Email"
                            variant="outlined"
                            required
                            placeholder="Ingrese el email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-form">
                        <TextField
                            id="outlined-basic-password"
                            label="Contraseña"
                            variant="outlined"
                            type="password"
                            required
                            placeholder="Ingrese la contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="input-form">
                        <TextField
                            id="outlined-basic-password-second"
                            label="Confirmar Contraseña"
                            variant="outlined"
                            type="password"
                            required
                            placeholder="Confirme la contraseña"
                            value={password_second}
                            onChange={(e) => setPasswordSecond(e.target.value)}
                        />
                    </div>
                    <div className="input-form">
                        <TextField
                            id="outlined-basic-cellphone"
                            label="Teléfono"
                            variant="outlined"
                            required
                            placeholder="Ingrese el teléfono"
                            value={cellphone}
                            onChange={(e) => setCellphone(e.target.value)}
                        />
                    </div>
                    <div className="input-form">
                        <Button variant="contained" onClick={handleAddUser}>Agregar Usuario</Button>
                    </div>
                    {users.length > 0 &&
                        <div className="input-form">
                            <h2>Usuarios Agregados:</h2>
                            <List>
                                {users.map((user, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={`${user.name} - ${user.email}`} />
                                    </ListItem>
                                ))}
                            </List>
                            <Button variant="contained" onClick={handleRegisterAll}>Registrar Todos</Button>
                        </div>
                    }
                </CardContent>
            </Card>
        </Container>
    );
};

export default Register;
