'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { createTeam, updateTeam } from '@/lib/actions'
import { toast } from 'sonner'
import { Team, Category, Series, Status } from '@prisma/client'

interface AddTeamModalProps {
  isOpen: boolean
  onClose: () => void
  teamToEdit?: Team | null
  initialCategory?: Category
  initialSeries?: Series
}

export default function AddTeamModal({ 
  isOpen, 
  onClose, 
  teamToEdit,
  initialCategory,
  initialSeries
}: AddTeamModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [category, setCategory] = useState<Category>(Category.VARONES)
  const [series, setSeries] = useState<Series>(Series.A)
  const [status, setStatus] = useState<Status>(Status.PENDIENTE)

  useEffect(() => {
    if (teamToEdit) {
      setName(teamToEdit.name)
      setGrade(teamToEdit.grade)
      setCategory(teamToEdit.category)
      setSeries(teamToEdit.series)
      setStatus(teamToEdit.status)
    } else {
      setName('')
      setGrade('')
      setCategory(initialCategory || Category.VARONES)
      setSeries(initialSeries || Series.A)
      setStatus(Status.PENDIENTE)
    }
  }, [teamToEdit, isOpen, initialCategory, initialSeries])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const data = { name, grade, category, series, status }
      let result
      
      if (teamToEdit) {
        result = await updateTeam(teamToEdit.id, data)
      } else {
        result = await createTeam(data)
      }
      
      if (result.success) {
        toast.success(teamToEdit ? 'Equipo actualizado' : 'Equipo registrado')
        onClose()
      } else {
        toast.error(result.error || 'Ocurrió un error')
      }
    } catch (error) {
      toast.error('Error al procesar la solicitud')
    } finally {
      setIsLoading(false)
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
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            {teamToEdit ? 'Editar equipo' : 'Añadir equipo'}
          </h2>
          <p className="text-gray-500 text-sm mb-6 font-medium">
            {teamToEdit ? 'Modifica los datos del equipo seleccionado.' : 'Completa los datos para inscribir al nuevo equipo.'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre del equipo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Los Halcones"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm shadow-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Curso</label>
              <input
                type="text"
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Ej. 6° A"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm bg-white shadow-sm"
                >
                  <option value="VARONES">Varones</option>
                  <option value="DAMAS">Damas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Serie</label>
                <select
                  value={series}
                  onChange={(e) => setSeries(e.target.value as Series)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm bg-white shadow-sm"
                >
                  <option value="A">Serie A</option>
                  <option value="B">Serie B</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm bg-white shadow-sm"
              >
                <option value="INSCRITO">Inscrito</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="RETIRADO">Retirado</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-800 text-white py-3 rounded-xl font-bold hover:bg-green-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-6 shadow-md shadow-green-900/10"
            >
              {isLoading && <Loader2 className="animate-spin" size={20} />}
              {teamToEdit ? 'Guardar cambios' : 'Registrar equipo'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
