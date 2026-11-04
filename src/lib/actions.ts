'use server'

import { getSession } from './session'
import prisma from './prisma'
import bcrypt from 'bcrypt'
import { Role, Category, Series, Status } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function login(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' }
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return { success: false, error: 'Contraseña incorrecta' }
    }

    const session = await getSession()
    session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    }
    await session.save()

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function logout() {
  try {
    const session = await getSession()
    session.destroy()
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al cerrar sesión' }
  }
}

export async function createTeam(data: { name: string, grade: string, category: Category, series: Series, status: Status }) {
  try {
    const session = await getSession()
    if (!session.user) return { success: false, error: 'No autorizado' }

    const team = await prisma.team.create({
      data: {
        ...data,
        createdById: session.user.id,
      },
    })

    revalidatePath('/')
    return { success: true, team }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'Ya existe un equipo con ese nombre en esta categoría y serie' }
    }
    return { success: false, error: 'Error al crear el equipo' }
  }
}

export async function updateTeam(id: string, data: { name: string, grade: string, category: Category, series: Series, status: Status }) {
  try {
    const session = await getSession()
    if (!session.user) return { success: false, error: 'No autorizado' }

    const existingTeam = await prisma.team.findUnique({ where: { id } })
    if (!existingTeam) return { success: false, error: 'Equipo no encontrado' }
    
    if (session.user.role !== 'ADMIN' && existingTeam.createdById !== session.user.id) {
      return { success: false, error: 'No tienes permiso para editar este equipo' }
    }

    const team = await prisma.team.update({
      where: { id },
      data,
    })

    revalidatePath('/')
    return { success: true, team }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'Ya existe un equipo con ese nombre en esta categoría y serie' }
    }
    return { success: false, error: 'Error al actualizar el equipo' }
  }
}

export async function deleteTeam(id: string) {
  try {
    const session = await getSession()
    if (!session.user) return { success: false, error: 'No autorizado' }

    const existingTeam = await prisma.team.findUnique({ where: { id } })
    if (!existingTeam) return { success: false, error: 'Equipo no encontrado' }

    if (session.user.role !== 'ADMIN' && existingTeam.createdById !== session.user.id) {
      return { success: false, error: 'No tienes permiso para eliminar este equipo' }
    }

    await prisma.team.delete({ where: { id } })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar el equipo' }
  }
}

export async function getManagers() {
  try {
    const session = await getSession()
    if (!session.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'No autorizado' }
    }

    const managers = await prisma.user.findMany({
      where: { role: Role.GESTOR },
      select: { id: true, username: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, managers }
  } catch (error) {
    return { success: false, error: 'Error al obtener gestores' }
  }
}

export async function createManager(username: string, passwordPlain: string) {
  try {
    const session = await getSession()
    if (!session.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'No autorizado' }
    }

    const passwordHash = await bcrypt.hash(passwordPlain, 10)

    const manager = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: Role.GESTOR,
      },
    })

    revalidatePath('/')
    return { success: true, manager }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'El nombre de usuario ya existe' }
    }
    return { success: false, error: 'Error al crear el gestor' }
  }
}

export async function deleteManager(id: string) {
  try {
    const session = await getSession()
    if (!session.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'No autorizado' }
    }

    await prisma.user.delete({ where: { id } })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar el gestor' }
  }
}
