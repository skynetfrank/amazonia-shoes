import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    apellido: { type: String, required: true },
    cedula: { type: String, required: false, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telefono: { type: String, required: false },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default: false, required: true },
    seller: {
      codigo: { type: String, required: false, unique: false },
      comision: { type: Number, default: 0, required: false },
      acumuladoVentas: { type: Number, default: 0, required: false },
      logo: String,
      description: String,
      rating: { type: Number, default: 0, required: false },
      numReviews: { type: Number, default: 0, required: false },
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model('User', userSchema);
export default User;
