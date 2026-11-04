'use client'

import { useState } from 'react'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { login } from '@/lib/actions'
import { toast } from 'sonner'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await login(username, password)
      if (result.success) {
        toast.success('Sesión iniciada correctamente')
        onClose()
        // No need for window.location.reload() as revalidatePath handles it
      } else {
        toast.error(result.error || 'Credenciales inválidas')
      }
    } catch (error) {
      toast.error('Ocurrió un error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-green-900 mb-2">Bienvenido de nuevo</h2>
          <p className="text-gray-500 text-sm mb-6 font-medium">Ingresa tus credenciales para administrar el campeonato.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre de usuario</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. admin"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mt-2">
              <p className="text-[11px] text-orange-800 leading-relaxed font-medium">
                Para la demostración, usa &quot;admin&quot; para ver el perfil administrador; cualquier otro usuario ingresará como gestor.
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-800 text-white py-3 rounded-xl font-bold hover:bg-green-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-6 shadow-md shadow-green-900/10"
            >
              {isLoading && <Loader2 className="animate-spin" size={20} />}
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
