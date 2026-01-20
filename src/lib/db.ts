import mysql from 'serverless-mysql'

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    timezone: '-05:00' // Lima, Perú (UTC-5)
  }
})

export async function executeQuery<T>({
  query,
  values
}: {
  query: string
  values?: any[]
}): Promise<T> {
  try {
    // Establecer zona horaria de Lima para que CURRENT_TIMESTAMP use hora local
    await db.query("SET time_zone = 'America/Lima'")
    const results = await db.query<T>(query, values)
    await db.end()
    return results
  } catch (error) {
    throw error
  }
}
