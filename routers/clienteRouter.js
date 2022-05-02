import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Cliente from '../models/clienteModel.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const clienteRouter = express.Router();

clienteRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await Cliente.remove({});
    const createdClientes = await Cliente.insertMany(data.clientes);
    res.send({ createdClientes });
  })
);

//Registrar Empresas Clientes
clienteRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const cliente = new Cliente({
      nombre: req.body.nombre,
      email: req.body.email,
      rif: req.body.rif,
      direccion: req.body.direccion,
      telefono: req.body.telefono,
      descuento: req.body.descuento,
      prontopago: req.body.prontopago,
      contacto: req.body.contacto,
      observaciones: req.body.observaciones,
    });
    const createdCliente = await cliente.save();
    res.send({
      _id: createdCliente._id,
      nombre: createdCliente.nombre,
      email: createdCliente.email,
      rif: createdCliente.rif,
      telefono: createdCliente.telefono,
      direccion: createdCliente.direccion,
      descuento: createdCliente.descuento,
      prontopago: createdCliente.prontopago,
      contacto: createdCliente.contacto,
      observaciones: createdCliente.observaciones,
    });
  })
);

clienteRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    if (cliente) {
      res.send(cliente);
    } else {
      res.status(404).send({ message: 'Empresa Cliente No Existe' });
    }
  })
);

clienteRouter.put(
  '/profile',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.body._id);
    if (cliente) {
      cliente.nombre = req.body.nombre || cliente.nombre;
      cliente.rif = req.body.rif || cliente.rif;
      cliente.email = req.body.email || cliente.email;
      cliente.direccion = req.body.direccion || cliente.direccion;
      cliente.telefono = req.body.telefono || cliente.telefono;
      cliente.descuento = req.body.descuento || cliente.descuento;
      cliente.prontopago = req.body.prontopago || cliente.prontopago;
      cliente.contacto = req.body.contacto || cliente.contacto;
      cliente.observaciones = req.body.observaciones || cliente.observaciones;

      const updatedCliente = await cliente.save();
      res.send({
        _id: updatedCliente._id,
        nombre: updatedCliente.nombre,
        email: updatedCliente.email,
      });
    }
  })
);

clienteRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const clientes = await Cliente.find({});
    res.send(clientes);
  })
);

clienteRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    if (cliente) {
      if (cliente.email === 'frank.uah@gmail.com') {
        res
          .status(400)
          .send({ message: 'No puede Eliminar al usuario Administrador' });
        return;
      }
      const deleteCliente = await cliente.remove();
      res.send({
        message: 'Empresa Cliente Eliminada',
        cliente: deleteCliente,
      });
    } else {
      res.status(404).send({ message: 'Empresa Cliente No Encontrada' });
    }
  })
);

export default clienteRouter;
