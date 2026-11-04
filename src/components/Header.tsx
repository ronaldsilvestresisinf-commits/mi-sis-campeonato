'use client'

import { LogOut, UserPlus, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface HeaderProps {
  user?: {
    username: string
    role: 'ADMIN' | 'GESTOR'
  }
  onLoginClick?: () => void
  onLogoutClick?: () => void
  onAddManagerClick?: () => void
}

export default function Header({ user, onLoginClick, onLogoutClick, onAddManagerClick }: HeaderProps) {
  return (
    <header className="bg-white border-b py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12">
           <Image
            src="/logo.png"
            alt="U.E.T.H. LAS ROSAS"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-green-900 leading-tight whitespace-nowrap">U.E.T.H. &quot;LAS ROSAS&quot;</h1>
          <p className="text-xs text-gray-500 font-medium whitespace-nowrap">Promoción 2026 - Campeonato de Secundaria</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!user ? (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors font-semibold text-sm shadow-sm"
          >
            <LogIn size={18} />
            Iniciar sesión
          </button>
        ) : (
          <div className="flex items-center gap-4">
            {user.role === 'ADMIN' && (
              <button
                onClick={onAddManagerClick}
                className="flex items-center gap-2 border border-green-800 text-green-800 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors font-semibold text-sm"
              >
                <UserPlus size={18} />
                + Gestor
              </button>
            )}
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                {user.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800">{user.username}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  {user.role === 'ADMIN' ? 'Administrador' : 'Gestor'}
                </span>
              </div>
              <button
                onClick={onLogoutClick}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
