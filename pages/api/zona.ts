// pages/api/zona.ts

import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

let zonasPorLocalidad: { idLocalidad: number; idZona: number; nombreZona: string }[] = []

// Leer y parsear el archivo zonas.txt una sola vez
const filePath = path.join(process.cwd(), 'zonas.txt')
const fileData = fs.readFileSync(filePath, 'utf-8')

fileData.split('\n').forEach(line => {
  const trimmed = line.trim()
  if (!trimmed) return
  const [idLocalidadStr, idZonaStr, nombreZona] = trimmed.split(',')
  const idLocalidad = parseInt(idLocalidadStr)
  const idZona = parseInt(idZonaStr)
  if (!isNaN(idLocalidad) && !isNaN(idZona) && nombreZona) {
    zonasPorLocalidad.push({ idLocalidad, idZona, nombreZona })
  }
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' }) // Solo GET permitido
  }

  const idLocalidadParam = req.query.idLocalidad

  if (!idLocalidadParam || Array.isArray(idLocalidadParam)) {
    return res.status(400).json({ error: 'Falta el parámetro idLocalidad' })
  }

  const idLocalidad = parseInt(idLocalidadParam)

  if (isNaN(idLocalidad)) {
    return res.status(400).json({ error: 'idLocalidad debe ser un número' })
  }

  const resultado = zonasPorLocalidad.find(z => z.idLocalidad === idLocalidad)

  if (!resultado) {
    return res.status(404).json({ error: 'Localidad no encontrada' })
  }

  return res.status(200).json({
    idZona: resultado.idZona,
    nombreZona: resultado.nombreZona,
  })
}
