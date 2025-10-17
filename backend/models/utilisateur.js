import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const utilisateurSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    photoUri: { type: String },
    pinKey: { type: String, unique: true, sparse: true, index: true },
  },
  { timestamps: true }
);

utilisateurSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

utilisateurSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);
export default Utilisateur;

