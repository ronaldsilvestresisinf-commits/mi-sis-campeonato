import { Edit2, X, Plus } from 'lucide-react'
import { Team, Status } from '@prisma/client'
import { cn } from '@/lib/utils'

interface TeamTableProps {
  title: string
  teams: Team[]
  canEdit: boolean
  onAddTeam: () => void
  onEditTeam: (team: Team) => void
  onDeleteTeam: (id: string) => void
}

const statusColors = {
  INSCRITO: 'bg-green-100 text-green-700 border-green-200',
  PENDIENTE: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  RETIRADO: 'bg-red-100 text-red-700 border-red-200',
}

const statusLabels = {
  INSCRITO: 'Inscrito',
  PENDIENTE: 'Pendiente',
  RETIRADO: 'Retirado',
}

export default function TeamTable({ 
  title, 
  teams, 
  canEdit, 
  onAddTeam, 
  onEditTeam, 
  onDeleteTeam 
}: TeamTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full min-h-[300px]">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 className="font-bold text-green-900 text-sm md:text-base">{title}</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
            {teams.length} {teams.length === 1 ? 'equipo' : 'equipos'}
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b bg-white sticky top-0">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Estado</th>
              {canEdit && <th className="px-4 py-3 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {teams.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 4 : 3} className="px-4 py-12 text-center text-gray-400 italic text-xs">
                  Aún no hay equipos inscritos
                </td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-3 font-bold text-gray-800 text-xs md:text-sm">{team.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-medium text-xs md:text-sm">{team.grade}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1.5 w-fit",
                      statusColors[team.status]
                    )}>
                      <span className="w-1 h-1 rounded-full bg-current" />
                      {statusLabels[team.status]}
                    </span>
                  </td>
                  {canEdit && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEditTeam(team)}
                          className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => onDeleteTeam(team.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {canEdit && (
        <div className="p-4 border-t mt-auto bg-gray-50/30">
          <button 
            onClick={onAddTeam}
            className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-bold hover:border-green-200 hover:text-green-600 hover:bg-green-50/50 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Añadir equipo
          </button>
        </div>
      )}
    </div>
  )
}
