import DashboardClient from '@/components/DashboardClient'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const session = await getSession()
  const teams = await prisma.team.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardClient 
        initialTeams={JSON.parse(JSON.stringify(teams))} 
        user={session.user} 
      />
      
      <footer className="mt-auto py-8 text-center">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
            2026 © Todos los derechos reservados
          </p>
          <p className="text-[11px] text-green-800 font-black tracking-widest">
            SILVERMAN
          </p>
        </div>
      </footer>
    </div>
  )
}
