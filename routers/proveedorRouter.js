import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Proveedor from '../models/proveedorModel.js';
import { isAdmin, isAuth } from '../utils.js';

const proveedorRouter = express.Router();

proveedorRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    await Proveedor.remove({});
    const createdProveedores = await Proveedor.insertMany(data.proveedores);
    res.send({ createdProveedores });
  })
);

//Registrar Empresas Proveedoras para crear una simple lista
proveedorRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const proveedor = new Proveedor({
      nombre: req.body.nombre,
      email: req.body.email,
    });
    const createdProveedor = await proveedor.save();
    res.send({
      _id: createdProveedor._id,
      nombre: createdProveedor.nombre,
      email: createdProveedor.email,
      rif: createdProveedor.rif,
      telefono: createdProveedor.telefono,
      direccion: createdProveedor.direccion,
      contacto: createdProveedor.contacto,
      observaciones: createdProveedor.observaciones,
    });
  })
);

proveedorRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const proveedor = await Proveedor.findById(req.params.id);
    if (proveedor) {
      res.send(proveedor);
    } else {
      res.status(404).send({ message: 'Proveedor No Existe' });
    }
  })
);
proveedorRouter.put(
  '/profile',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const proveedor = await Proveedor.findById(req.proveedor._id);
    if (proveedor) {
      proveedor.nombre = req.body.nombre || proveedor.nombre;
      proveedor.email = req.body.email || proveedor.email;
      proveedor.direccion = req.body.email || proveedor.direccion;
      proveedor.telefono = req.body.email || proveedor.telefono;
      proveedor.descuento = req.body.email || proveedor.descuento;
      proveedor.prontopago = req.body.email || proveedor.email;
      proveedor.contacto = req.body.email || proveedor.contacto;
      proveedor.observaciones = req.body.email || proveedor.observaciones;

      const updatedProveedor = await prveedor.save();
      res.send({
        _id: updatedProveedor._id,
        nombre: updatedProveedor.nombre,
        email: updatedProveedor.email,
      });
    }
  })
);

proveedorRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const proveedores = await Proveedor.find({});
    res.send(proveedores);
  })
);

proveedorRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const proveedor = await Proveedor.findById(req.params.id);
    if (proveedor) {
      const deleteProveedor = await proveedor.remove();
      res.send({
        message: 'Proveedor Eliminado',
        proveedor: deleteProveedor,
      });
    } else {
      res.status(404).send({ message: 'Proveedor No Encontrado' });
    }
  })
);

export default proveedorRouter;
