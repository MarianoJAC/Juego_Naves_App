export type TipoEnemigo = 'default' | 'enemigo1' | 'enemigo2';

type ObjetoDeJuego = { 
  id: number; 
  x: number; 
  y: number; 
  tipo?: TipoEnemigo; 
  vida?: number; 
};
type EstadoDeJuego = 'PantallaDeInicio' | 'Jugando' | 'PantallaDeOpciones' | 'PantallaDeReglas';
type Dificultad = 'Facil' | 'Medio' | 'Dificil';
type VelocidadJuego = 'Normal' | 'Rapida' | 'UltraRapida';

interface OpcionesJuego {
  vidas: number;
  dificultad: Dificultad;
  velocidad: VelocidadJuego;
}

export { ObjetoDeJuego, EstadoDeJuego, OpcionesJuego, Dificultad, VelocidadJuego };