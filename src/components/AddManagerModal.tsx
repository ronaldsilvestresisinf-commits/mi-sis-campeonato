'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Eye, EyeOff, Trash2 } from 'lucide-react'
import { createManager, getManagers, deleteManager } from '@/lib/actions'
import { toast } from 'sonner'

interface AddManagerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddManagerModal({ isOpen, onClose }: AddManagerModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [managers, setManagers] = useState<any[]>([])
  const [isFetching, setIsFetching] = useState(false)

  const fetchManagers = async () => {
    setIsFetching(true)
    const result = await getManagers()
    if (result.success) {
      setManagers(result.managers || [])
    }
    setIsFetching(false)
  }

  useEffect(() => {
    if (isOpen) {
      fetchManagers()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }
    setIsLoading(true)
    
    try {
      const result = await createManager(username, password)
      
      if (result.success) {
        toast.success('Gestor creado correctamente')
        setUsername('')
        setPassword('')
        fetchManagers()
      } else {
        toast.error(result.error || 'Error al crear gestor')
      }
    } catch (error) {
      toast.error('Ocurrió un error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar a este gestor?')) return
    
    try {
      const result = await deleteManager(id)
      if (result.success) {
        toast.success('Gestor eliminado')
        fetchManagers()
      } else {
        toast.error(result.error || 'Error al eliminar')
      }
    } catch (error) {
      toast.error('Error al procesar la solicitud')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1"
        >
          <X size={20} />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-green-900 mb-2">Gestión de gestores</h2>
          <p className="text-gray-500 text-sm mb-6 font-medium">Crea y administra las cuentas con acceso al campeonato.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre de usuario</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej. juan.perez"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm shadow-sm"
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
                    placeholder="Mínimo 8"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-800 text-white py-2.5 rounded-xl font-bold hover:bg-green-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-green-900/10"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              + Crear gestor
            </button>
          </form>

          <div className="border-t pt-6">
            <h3 className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-4">Gestores activos</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {isFetching ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-gray-300" size={24} />
                </div>
              ) : managers.length === 0 ? (
                <p className="text-center text-gray-400 text-xs py-4 italic">No hay gestores registrados</p>
              ) : (
                managers.map((manager) => (
                  <div key={manager.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-green-700 shadow-sm border border-green-50">
                        {manager.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{manager.username}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Gestor</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(manager.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-white shadow-sm md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
