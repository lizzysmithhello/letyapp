/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sparkles, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: { email: string; name: string; avatarUrl: string; provider: 'email' | 'google' }) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isGoogleOverlayOpen, setIsGoogleOverlayOpen] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  // ---------------------------------------------------------
  // MOCK USER DATABASE IN LOCAL STORAGE
  // ---------------------------------------------------------
  const getRegisteredUsers = () => {
    const saved = localStorage.getItem('lety_registered_users_v3');
    return saved ? JSON.parse(saved) : [];
  };

  const saveRegisteredUsers = (users: any[]) => {
    localStorage.setItem('lety_registered_users_v3', JSON.stringify(users));
  };

  // ---------------------------------------------------------
  // EMAIL / PASSWORD LOGIN & REGISTRATION
  // ---------------------------------------------------------
  const handleEmailAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail || !password) {
      setErrorMsg('Por favor rellena todos los campos requeridos.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const users = getRegisteredUsers();

    if (isRegisterMode) {
      if (!trimmedName) {
        setErrorMsg('Por favor ingresa tu nombre completo para el registro.');
        return;
      }

      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: trimmedEmail,
            name: trimmedName,
            avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(trimmedName)}`,
            provider: 'email',
            password
          })
        });
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          setErrorMsg(data.msg || 'Error al registrar en el servidor.');
          return;
        }

        // Save locally to support offline fallback redundantly
        if (!users.some((u: any) => u.email === trimmedEmail)) {
          saveRegisteredUsers([...users, data.user]);
        }

        setSuccessMsg('¡Usuario registrado con éxito! Iniciando sesión...');
        
        setTimeout(() => {
          onLoginSuccess({
            email: data.user.email,
            name: data.user.name,
            avatarUrl: data.user.avatarUrl,
            provider: 'email'
          });
        }, 1200);
      } catch (err: any) {
        console.error('Error registering:', err);
        setErrorMsg('Error de conexión con el servidor. Inténtalo más tarde.');
      }

    } else {
      // Find or register credentials with server to ensure multi-device synchronization
      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: trimmedEmail,
            password,
            provider: 'email'
          })
        });
        const data = await res.json();
        
        if (res.status === 401) {
          setErrorMsg('Contraseña incorrecta. Inténtalo de nuevo.');
          return;
        }

        if (res.ok && data.success) {
          // Sync locally
          const updatedLocal = users.filter((u: any) => u.email !== trimmedEmail);
          saveRegisteredUsers([...updatedLocal, data.user]);

          setSuccessMsg('¡Inicio de sesión exitoso! Bienvenido.');
          
          setTimeout(() => {
            onLoginSuccess({
              email: data.user.email,
              name: data.user.name,
              avatarUrl: data.user.avatarUrl,
              provider: 'email'
            });
          }, 1200);
          return;
        }

        // Fallback local lookup if server is not recognizing (not registered on server yet)
        const user = users.find((u: any) => u.email === trimmedEmail);
        if (!user) {
          setErrorMsg('El correo no se encuentra registrado en la nube ni localmente. Regístrate primero.');
          return;
        }

        if (user.password !== password) {
          setErrorMsg('Contraseña incorrecta. Inténtalo de nuevo.');
          return;
        }

        // Try syncing local account to the server now
        try {
          await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...user,
              provider: 'email'
            })
          });
        } catch (syncErr) {
          console.warn('Silent sync to server failed:', syncErr);
        }

        setSuccessMsg('¡Inicio de sesión exitoso! Bienvenido (Modo Sincronizado).');
        
        setTimeout(() => {
          onLoginSuccess({
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            provider: 'email'
          });
        }, 1200);

      } catch (err: any) {
        console.error('Error logging in:', err);
        // True offline mode login
        const user = users.find((u: any) => u.email === trimmedEmail);
        if (user && user.password === password) {
          setSuccessMsg('¡Inicio de sesión exitoso (Modo Local Offline)!');
          setTimeout(() => {
            onLoginSuccess({
              email: user.email,
              name: user.name,
              avatarUrl: user.avatarUrl,
              provider: 'email'
            });
          }, 1200);
        } else {
          setErrorMsg('Contraseña o correo incorrectos y el servidor no responde.');
        }
      }
    }
  };

  // ---------------------------------------------------------
  // MOCK GOOGLE AUTHENTICATION (POPUP OVERLAY)
  // ---------------------------------------------------------
  const triggerGoogleLoginOptions = () => {
    setIsGoogleOverlayOpen(true);
    setGoogleEmailInput('');
    setGoogleNameInput('');
    setErrorMsg('');
  };

  const handleGoogleMockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const gEmail = googleEmailInput.trim().toLowerCase();
    const gName = googleNameInput.trim();

    if (!gEmail) {
      alert('Por favor ingresa tu cuenta de Gmail Google.');
      return;
    }

    const finalName = gName || gEmail.split('@')[0];
    const googleUser = {
      email: gEmail,
      name: finalName,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(finalName)}`,
      provider: 'google' as const
    };

    try {
      // Store on server too to be visible in admin options
      await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUser)
      });
    } catch (err) {
      console.warn('Could not register Google user on server:', err);
    }

    // Save locally
    const users = getRegisteredUsers();
    if (!users.some((u: any) => u.email === gEmail)) {
      saveRegisteredUsers([...users, googleUser]);
    }

    setIsGoogleOverlayOpen(false);
    onLoginSuccess(googleUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-450 via-fuchsia-500 to-indigo-600 relative overflow-hidden font-sans">
      
      {/* Dynamic Animated Blobs to make the colors alive and vivid */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-pink-400 blur-3xl opacity-45 mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-amber-400 blur-3xl opacity-40 mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] right-[20%] w-80 h-80 rounded-full bg-violet-400 blur-3xl opacity-35 mix-blend-color-burn animate-bounce" style={{ animationDuration: '8s' }} />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-white overflow-hidden relative z-15 transition-all duration-300 hover:shadow-pink-500/20">
        
        {/* Colorful Gradient Header */}
        <div className="bg-gradient-to-r from-rose-500 via-fuchsia-600 to-indigo-600 p-8 text-center text-white relative">
          <div className="absolute top-2 right-3 text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full border border-white/20">
            Ahorro & Amor
          </div>
          <span className="text-4xl block mb-2 animate-bounce">👩‍👧‍👦</span>
          <h2 className="text-2xl font-serif font-black tracking-tight drop-shadow-xs">Lety App v3</h2>
          <p className="text-rose-100 text-xs mt-1 font-medium">
            Inicia sesión o regístrate para cuidar a la abuela y administrar el presupuesto familiar.
          </p>
        </div>

        {/* Action Form */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Tabs for Login / Register Selector */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-stone-100 rounded-xl">
            <button
              onClick={() => { setIsRegisterMode(false); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition duration-200 ${!isRegisterMode ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setIsRegisterMode(true); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition duration-200 ${isRegisterMode ? 'bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
            >
              Registrarse
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2.5 font-semibold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs rounded-xl flex items-center gap-2.5 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleEmailAction} className="space-y-4">
            {isRegisterMode && (
              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-500 uppercase tracking-wider">Tu Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="Leticia Rodríguez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 bg-stone-50/50 font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[11px] font-black text-stone-500 uppercase tracking-wider">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 bg-stone-50/50 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-black text-stone-500 uppercase tracking-wider">Contraseña</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 bg-stone-50/50 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white font-bold rounded-xl text-xs shadow-md shadow-pink-500/10 cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 hover:gap-2"
            >
              <span>{isRegisterMode ? 'Registrar Cuenta' : 'Iniciar Sesión'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* OR Separator line */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-[10px] text-stone-400 font-extrabold uppercase tracking-widest">O continúa con</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={triggerGoogleLoginOptions}
            className="w-full py-2.5 bg-stone-900 text-white font-bold rounded-xl text-xs hover:bg-stone-800 transition shadow-sm border border-stone-850 cursor-pointer flex items-center justify-center gap-2.5"
          >
            {/* Real SVG Google Icon G */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.19-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Iniciar Sesión con Google</span>
          </button>

          {/* Quick Demo Credentials Help */}
          <div className="p-3 bg-amber-500/10 border border-amber-200 rounded-2xl text-[10px] text-amber-900 leading-normal flex gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Acceso rápido demo:</strong> Registra o inicia sesión con cualquier correo. Recuerda que <strong>solo el usuario Ericka</strong> (puedes registrarte con este nombre o simular el inicio con Google) tiene permisos para editar parámetros del presupuesto y modificar las frases de mamá en la pestaña de Presupuesto.
            </div>
          </div>
        </div>

        {/* Tribute Footer in Card */}
        <div className="bg-stone-50 border-t border-stone-100 p-4 text-center">
          <span className="text-[10px] text-stone-400 italic block font-serif">
            "Para el mundo puedes ser una mamá; para tus hijos eres el mundo entero." ❤️
          </span>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
       * GOOGLE MOCK OAUTH POPUP OVERLAY
       * ------------------------------------------------------------------------- */}
      {isGoogleOverlayOpen && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-stone-100 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.19-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="font-sans font-bold text-stone-800 text-sm">Iniciar Sesión con Google</span>
              </div>
              <button
                onClick={() => setIsGoogleOverlayOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-850 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGoogleMockSubmit} className="space-y-4">
              <div className="text-center p-3 bg-blue-50/60 rounded-2xl border border-blue-100 mb-2">
                <p className="text-[11px] text-blue-900 leading-normal font-medium">
                  Google se asocia de forma segura con <strong>Lety App</strong> para compartir tu correo y nombre de perfil de forma rápida.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-500 uppercase">Tu Cuenta de Google (Gmail)</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@gmail.com"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black text-stone-500 uppercase">Nombre para Mostrar (Opcional)</label>
                <input
                  type="text"
                  placeholder="Leticia Rodríguez (Dejar vacío para autogenerar)"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
              >
                Autorizar Google Single Sign-In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
