'use client'

import { useState } from 'react'
import Header from './Header'
import TeamTable from './TeamTable'
import LoginModal from './LoginModal'
import AddTeamModal from './AddTeamModal'
import AddManagerModal from './AddManagerModal'
import { logout, deleteTeam } from '@/lib/actions'
import { Category, Series, Team } from '@prisma/client'
import { toast } from 'sonner'
import Image from 'next/image'

interface DashboardClientProps {
  initialTeams: Team[]
  user?: {
    id: string
    username: string
    role: 'ADMIN' | 'GESTOR'
  }
}

export default function DashboardClient({ initialTeams, user }: DashboardClientProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false)
  const [isAddManagerOpen, setIsAddManagerOpen] = useState(false)
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.VARONES)
  const [selectedSeries, setSelectedSeries] = useState<Series>(Series.A)

  const handleLogout = async () => {
    await logout()
    toast.success('Sesión cerrada')
  }

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este equipo?')) return
    const result = await deleteTeam(id)
    if (result.success) {
      toast.success('Equipo eliminado')
    } else {
      toast.error(result.error || 'Error al eliminar')
    }
  }

  const filterTeams = (cat: Category, ser: Series) => {
    return initialTeams.filter(t => t.category === cat && t.series === ser)
  }

  const totalTeams = initialTeams.length
  const confirmedTeams = initialTeams.filter(t => t.status === 'INSCRITO').length

  return (
    <>
      <Header 
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={handleLogout}
        onAddManagerClick={() => setIsAddManagerOpen(true)}
      />

      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="bg-green-800 rounded-[2rem] p-6 md:p-10 mb-8 md:mb-12 relative overflow-hidden text-white shadow-xl shadow-green-900/20">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-4">
              <span className="h-[2px] w-8 bg-yellow-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400">Gestión del Campeonato</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Equipos participantes</h2>
            <p className="text-green-100 max-w-xl text-xs md:text-sm leading-relaxed font-medium">
              Consulta los equipos inscritos por categoría y serie para el campeonato estudiantil 2026.
            </p>
          </div>
          
          <div className="mt-8 md:mt-0 md:absolute md:top-1/2 md:-translate-y-1/2 md:right-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 flex gap-6 md:gap-8 border border-white/20 w-fit">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black">{totalTeams}</p>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-green-200">Equipos</p>
            </div>
            <div className="w-[1px] bg-white/20" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-yellow-400">{confirmedTeams}</p>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-green-200">Confirmados</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-between mb-8 px-4">
          <h3 className="text-base font-black text-green-900 tracking-wider flex items-center gap-6">
            <span className="h-[2px] w-12 bg-green-800" />
            CATEGORÍA MASCULINA
          </h3>
          <div className="w-14 h-14 relative mx-8">
            <Image
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=escudo%20colegio%20las%20rosas%20emblem%20logo&image_size=square"
              alt="Escudo"
              fill
              className="object-contain opacity-20 grayscale"
            />
          </div>
          <h3 className="text-base font-black text-green-900 tracking-wider flex items-center gap-6 text-right">
            CATEGORÍA FEMENINA
            <span className="h-[2px] w-12 bg-green-800" />
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-6">
            <div className="md:hidden text-center py-2 bg-green-50 rounded-lg mb-2">
              <span className="text-[10px] font-black text-green-800 uppercase tracking-widest">Categoría Masculina</span>
            </div>
            <TeamTable 
              title="Serie A"
              teams={filterTeams(Category.VARONES, Series.A)}
              canEdit={!!user}
              onAddTeam={() => {
                setSelectedCategory(Category.VARONES)
                setSelectedSeries(Series.A)
                setTeamToEdit(null)
                setIsAddTeamOpen(true)
              }}
              onEditTeam={(team) => {
                setTeamToEdit(team)
                setIsAddTeamOpen(true)
              }}
              onDeleteTeam={handleDeleteTeam}
            />
          </div>
          <TeamTable 
            title="Serie B"
            teams={filterTeams(Category.VARONES, Series.B)}
            canEdit={!!user}
            onAddTeam={() => {
              setSelectedCategory(Category.VARONES)
              setSelectedSeries(Series.B)
              setTeamToEdit(null)
              setIsAddTeamOpen(true)
            }}
            onEditTeam={(team) => {
              setTeamToEdit(team)
              setIsAddTeamOpen(true)
            }}
            onDeleteTeam={handleDeleteTeam}
          />
          <div className="space-y-6">
            <div className="md:hidden text-center py-2 bg-pink-50 rounded-lg mb-2">
              <span className="text-[10px] font-black text-pink-800 uppercase tracking-widest">Categoría Femenina</span>
            </div>
            <TeamTable 
              title="Serie A"
              teams={filterTeams(Category.DAMAS, Series.A)}
              canEdit={!!user}
              onAddTeam={() => {
                setSelectedCategory(Category.DAMAS)
                setSelectedSeries(Series.A)
                setTeamToEdit(null)
                setIsAddTeamOpen(true)
              }}
              onEditTeam={(team) => {
                setTeamToEdit(team)
                setIsAddTeamOpen(true)
              }}
              onDeleteTeam={handleDeleteTeam}
            />
          </div>
          <TeamTable 
            title="Serie B"
            teams={filterTeams(Category.DAMAS, Series.B)}
            canEdit={!!user}
            onAddTeam={() => {
              setSelectedCategory(Category.DAMAS)
              setSelectedSeries(Series.B)
              setTeamToEdit(null)
              setIsAddTeamOpen(true)
            }}
            onEditTeam={(team) => {
              setTeamToEdit(team)
              setIsAddTeamOpen(true)
            }}
            onDeleteTeam={handleDeleteTeam}
          />
        </div>
      </main>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
      
      <AddTeamModal 
        isOpen={isAddTeamOpen} 
        onClose={() => {
          setIsAddTeamOpen(false)
          setTeamToEdit(null)
        }}
        teamToEdit={teamToEdit}
        initialCategory={selectedCategory}
        initialSeries={selectedSeries}
      />
      
      <AddManagerModal 
        isOpen={isAddManagerOpen} 
        onClose={() => setIsAddManagerOpen(false)} 
      />
    </>
  )
}
