import { NextResponse } from 'next/server';
import { supabaseSecret } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    // Leggi il file SQL completo
    const sqlPath = path.join(process.cwd(), 'docs/database/COMPLETE_DATABASE_ALL_TABLES.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Esegui lo script SQL
    const { data, error } = await supabaseSecret.rpc('exec_sql', {
      sql: sqlContent
    });

    if (error) {
      return NextResponse.json({
        success: false,
        message: `Errore esecuzione SQL: ${error.message}`,
        error: error
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Tabelle create con successo!',
      result: data
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Errore: ${error}`,
      error: error
    });
  }
}
