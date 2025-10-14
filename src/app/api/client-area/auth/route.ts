import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password richiesta' },
        { status: 400 }
      );
    }

    // Ottieni la password dalle variabili d'ambiente
    const correctPassword = process.env.AREA_CLIENTI_PASSWORD;

    if (!correctPassword) {
      console.error('AREA_CLIENTI_PASSWORD non configurata nelle variabili d\'ambiente');
      return NextResponse.json(
        { success: false, error: 'Configurazione non valida' },
        { status: 500 }
      );
    }

    // Verifica la password
    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: 'Password non corretta' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Errore durante l\'autenticazione:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
