
import React, { useState } from 'react';
import { User } from '../types';

interface AuthFormsProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const AuthForms: React.FC<AuthFormsProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Mock Login logic
      const savedState = JSON.parse(localStorage.getItem('mexihaiti_state') || '{}');
      const users = savedState.users || [];
      const user = users.find((u: any) => u.email === email);
      
      if (user) {
        onLogin(user);
      } else {
        alert('Credenciales inválidas o usuario no registrado');
      }
    } else {
      // Mock Register logic
      if (password.length < 8) return alert('La contraseña debe tener al menos 8 caracteres');
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        firstName,
        lastName,
        email,
        phone,
        balance: 0,
        isAdmin: email.includes('admin'),
      };
      onRegister(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 overflow-hidden relative">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md glass p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-lg">MH</div>
          <h1 className="text-3xl font-black text-slate-800">MexiHaiti</h1>
          <p className="text-slate-500 mt-2">{isLogin ? '¡Bienvenido de nuevo!' : 'Crea tu cuenta gratis'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nombre</label>
                <input 
                  type="text" 
                  required 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Apellido</label>
                <input 
                  type="text" 
                  required 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="nombre@ejemplo.com"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Número de Teléfono</label>
              <input 
                type="tel" 
                required 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="+52 ..."
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Contraseña</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/30 hover:bg-blue-800 transition-all transform hover:-translate-y-0.5"
          >
            {isLogin ? 'Iniciar Sesión' : 'Registrarse Ahora'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-2">
          <p className="text-slate-500 text-sm">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-bold text-blue-900 hover:underline"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
          <button className="text-xs text-slate-400 hover:text-blue-600">¿Olvidaste tu contraseña?</button>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;
