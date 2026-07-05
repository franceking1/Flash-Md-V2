import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'sudo.json')

function ensureFile() {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]))
}

export function loadSudoList() {
  ensureFile()
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    return new Set(JSON.parse(data))
  } catch {
    return new Set()
  }
}

export function saveSudoList(set) {
  ensureFile()
  fs.writeFileSync(filePath, JSON.stringify([...set]))
}
