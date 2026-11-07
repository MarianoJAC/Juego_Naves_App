
import { useState, useEffect, useRef } from 'react';
import { useWindowDimensions, PanResponder, Alert, Vibration } from 'react-native';
import {
  NAVE_POSICION_INICIAL_Y,
  VELOCIDAD_BALA,
  CADENCIA_DISPARO,
  INTERVALO_AUMENTO_VELOCIDAD,
  INTERVALO_AUMENTO_FRECUENCIA,
  DURACION_INVENCIBILIDAD,
  MAXIMO_ENEMIGOS,
} from '../constants/constantesJuego';
import { formatearTiempo } from '../utils/utilidadesJuego';
import { ObjetoDeJuego, EstadoDeJuego, OpcionesJuego, Dificultad, VelocidadJuego, TipoEnemigo } from '../types/tiposJuego';
import { TAMANIO_ENEMIGO_DEFAULT, TAMANIO_ENEMIGO_GRANDE } from '../components/Enemigo';



const PRESETS_DIFICULTAD = {
  Facil: { velocidad: 2, frecuencia: 1000, frecDisparo: 2500, velDisparo: 4, probDisparo: 0.15 },
  Medio: { velocidad: 3.5, frecuencia: 700, frecDisparo: 2000, velDisparo: 5, probDisparo: 0.2 },
  Dificil: { velocidad: 6, frecuencia: 250, frecDisparo: 1000, velDisparo: 7, probDisparo: 0.35 },
};

const PRESETS_VELOCIDAD = {
  Normal: { bala: 10, juego: 1 },
  Rapida: { bala: 15, juego: 1.5 },
  UltraRapida: { bala: 20, juego: 2 },
};

const detectarColisiones = (
  balas: ObjetoDeJuego[],
  enemigos: ObjetoDeJuego[],
  asteroides: ObjetoDeJuego[],
  potenciadores: ObjetoDeJuego[],
  balasEnemigas: ObjetoDeJuego[],
  posicionNave: { x: number, y: number },
  esInvencible: boolean,
  manejarGolpeNave: () => void,
  setPuntuacion: React.Dispatch<React.SetStateAction<number>>,
  setNivelDisparo: React.Dispatch<React.SetStateAction<number>>,
  nivelDisparo: number,
  siguienteIdPotenciador: React.MutableRefObject<number>,
  setPotenciadores: React.Dispatch<React.SetStateAction<ObjetoDeJuego[]>>,
  ANCHO_PANTALLA: number,
  ALTO_PANTALLA: number
) => {
  const balasEliminadas = new Set<number>();
  const enemigosEliminados = new Set<number>();
  const asteroidesEliminados = new Set<number>();
  const potenciadoresEliminados = new Set<number>();
  const balasEnemigasEliminadas = new Set<number>();

  // Colisiones de balas con enemigos
  balas.forEach(bala => {
    if (balasEliminadas.has(bala.id)) return;

    for (const enemigo of enemigos) {
      if (enemigosEliminados.has(enemigo.id)) continue;

      const distancia = Math.hypot(bala.x - enemigo.x, (ALTO_PANTALLA - bala.y) - enemigo.y);
      if (distancia < 35) {
        balasEliminadas.add(bala.id);
        enemigo.vida = (enemigo.vida || 1) - 1;
        if (enemigo.vida <= 0) {
          enemigosEliminados.add(enemigo.id);
          setPuntuacion(p => p + 10);
        }
        return;
      }
    }
  });

  // Colisiones de nave con enemigos
  enemigos.forEach(enemigo => {
    if (enemigosEliminados.has(enemigo.id)) return;
    if (!esInvencible) {
      const distancia = Math.hypot(posicionNave.x - enemigo.x, (ALTO_PANTALLA - posicionNave.y) - enemigo.y);
      if (distancia < 75) {
        manejarGolpeNave();
        enemigosEliminados.add(enemigo.id);
      }
    }
  });

  // Colisiones de balas con asteroides
  balas.forEach(bala => {
    if (balasEliminadas.has(bala.id)) return;

    for (const asteroide of asteroides) {
      if (asteroidesEliminados.has(asteroide.id)) continue;

      const distancia = Math.hypot(bala.x - asteroide.x, (ALTO_PANTALLA - bala.y) - asteroide.y);
      if (distancia < 45) {
        balasEliminadas.add(bala.id);
        asteroidesEliminados.add(asteroide.id);
        setPotenciadores(prev => [...prev, { id: siguienteIdPotenciador.current++, x: asteroide.x, y: asteroide.y }]);
      }
    }
  });

  // Colisiones de nave con asteroides
  asteroides.forEach(asteroide => {
    if (asteroidesEliminados.has(asteroide.id)) return;
    if (!esInvencible) {
      const distancia = Math.hypot(posicionNave.x - asteroide.x, (ALTO_PANTALLA - posicionNave.y) - asteroide.y);
      if (distancia < 75) {
        manejarGolpeNave();
        asteroidesEliminados.add(asteroide.id);
      }
    }
  });

  // Colisiones de nave con potenciadores
  potenciadores.forEach(potenciador => {
    if (potenciadoresEliminados.has(potenciador.id)) return;
    const distancia = Math.hypot(posicionNave.x - potenciador.x, (ALTO_PANTALLA - posicionNave.y) - potenciador.y);
    if (distancia < 75) {
      if (nivelDisparo >= 3) {
        setPuntuacion(p => p + 50);
      } else {
        setNivelDisparo(n => Math.min(n + 1, 3));
      }
      potenciadoresEliminados.add(potenciador.id);
    }
  });

  // Colisiones de nave con balas enemigas
  balasEnemigas.forEach(balaEnemiga => {
    if (balasEnemigasEliminadas.has(balaEnemiga.id)) return;
    if (!esInvencible) {
      const distancia = Math.hypot(posicionNave.x - balaEnemiga.x, (ALTO_PANTALLA - posicionNave.y) - balaEnemiga.y);
      if (distancia < 50) {
        manejarGolpeNave();
        balasEnemigasEliminadas.add(balaEnemiga.id);
      }
    }
  });

  return {
    balasEliminadas,
    enemigosEliminados,
    asteroidesEliminados,
    potenciadoresEliminados,
    balasEnemigasEliminadas,
  };
};

export const usarLogicaJuego = () => {
  const { width: ANCHO_PANTALLA, height: ALTO_PANTALLA } = useWindowDimensions();
  // Estado de Opciones
  const [opcionesJuego, setOpcionesJuego] = useState<OpcionesJuego>({ vidas: 3, dificultad: 'Medio', velocidad: 'Normal' });

  // Manejo del Estado del Juego
  const [estadoDeJuego, setEstadoDeJuego] = useState<EstadoDeJuego>('PantallaDeInicio');
  const [esFinDeJuego, setEsFinDeJuego] = useState(false);

  // Datos del Juego
  const [posicionNave, setPosicionNave] = useState({ x: ANCHO_PANTALLA / 2, y: NAVE_POSICION_INICIAL_Y });
  const [enemigos, setEnemigos] = useState<ObjetoDeJuego[]>([]);
  const [balas, setBalas] = useState<ObjetoDeJuego[]>([]);
  const [asteroides, setAsteroides] = useState<ObjetoDeJuego[]>([]);
  const [potenciadores, setPotenciadores] = useState<ObjetoDeJuego[]>([]);
  const [balasEnemigas, setBalasEnemigas] = useState<ObjetoDeJuego[]>([]);
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [vidas, setVidas] = useState<number>(opcionesJuego.vidas);
  const [esInvencible, setEsInvencible] = useState(false);
  const [naveVisible, setNaveVisible] = useState(true);
  const [estaDisparando, setEstaDisparando] = useState(false);
  const [nivelDisparo, setNivelDisparo] = useState(1);

  // Refs para la Lógica del Juego
  const bucleJuegoRef = useRef<number | null>(null);
  const siguienteIdEnemigo = useRef(0);
  const siguienteIdBala = useRef(0);
  const siguienteIdAsteroide = useRef(0);
  const siguienteIdPotenciador = useRef(0);
  const siguienteIdBalaEnemiga = useRef(0);
  const posicionNaveRef = useRef(posicionNave);
  const velocidadEnemigoRef = useRef(PRESETS_DIFICULTAD[opcionesJuego.dificultad].velocidad);
  const frecuenciaAparicionEnemigoRef = useRef(PRESETS_DIFICULTAD[opcionesJuego.dificultad].frecuencia);
  const frecDisparoRef = useRef(PRESETS_DIFICULTAD[opcionesJuego.dificultad].frecDisparo);
  const velDisparoRef = useRef(PRESETS_DIFICULTAD[opcionesJuego.dificultad].velDisparo);
  const probDisparoRef = useRef(PRESETS_DIFICULTAD[opcionesJuego.dificultad].probDisparo);
  const velocidadBalaRef = useRef(PRESETS_VELOCIDAD[opcionesJuego.velocidad].bala);
  const multiplicadorVelocidadJuegoRef = useRef(PRESETS_VELOCIDAD[opcionesJuego.velocidad].juego);
  const posicionInicioArrastre = useRef({ x: 0, y: 0 });
  const puntuacionParaVidaExtraRef = useRef(1000);

  useEffect(() => { posicionNaveRef.current = posicionNave; }, [posicionNave]);

  useEffect(() => {
    if (puntuacion >= puntuacionParaVidaExtraRef.current) {
      setVidas(v => v + 1);
      puntuacionParaVidaExtraRef.current += 1000;
    }
  }, [puntuacion]);

  // --- Lógica Central del Juego ---

  const actualizarOpciones = (nuevasOpciones: Partial<OpcionesJuego>) => {
    setOpcionesJuego(prev => ({ ...prev, ...nuevasOpciones }));
  };

  const reiniciarVariablesJuego = () => {
    const { dificultad, velocidad, vidas } = opcionesJuego;
    const presetDificultad = PRESETS_DIFICULTAD[dificultad];
    velocidadEnemigoRef.current = presetDificultad.velocidad;
    frecuenciaAparicionEnemigoRef.current = presetDificultad.frecuencia;
    frecDisparoRef.current = presetDificultad.frecDisparo;
    velDisparoRef.current = presetDificultad.velDisparo;
    probDisparoRef.current = presetDificultad.probDisparo;

    velocidadBalaRef.current = PRESETS_VELOCIDAD[velocidad].bala;
    multiplicadorVelocidadJuegoRef.current = PRESETS_VELOCIDAD[velocidad].juego;

    setEnemigos([]);
    setBalas([]);
    setAsteroides([]);
    setPotenciadores([]);
    setBalasEnemigas([]);
    setNivelDisparo(1);
    setPuntuacion(0);
    setTiempo(0);
    setVidas(vidas);
    setEsInvencible(false);
    setNaveVisible(true);
    setPosicionNave({ x: ANCHO_PANTALLA / 2, y: NAVE_POSICION_INICIAL_Y });
    setEsFinDeJuego(false);
    siguienteIdEnemigo.current = 0;
    siguienteIdBala.current = 0;
    siguienteIdAsteroide.current = 0;
    siguienteIdPotenciador.current = 0;
    siguienteIdBalaEnemiga.current = 0;
    puntuacionParaVidaExtraRef.current = 1000;
  };

  const iniciarJuego = () => {
    setEstadoDeJuego('PantallaDeReglas');
  };

  const comenzarJuego = () => {
    reiniciarVariablesJuego();
    setEstadoDeJuego('Jugando');
  };

  const volverAlMenu = () => {
    setEstadoDeJuego('PantallaDeInicio');
  };

  const irAPantallaDeOpciones = () => {
    setEstadoDeJuego('PantallaDeOpciones');
  };

  const manejarGolpeNave = () => {
    Vibration.vibrate(500);
    setNivelDisparo(1);
    if (vidas > 1) {
      setVidas(l => l - 1);
      setEsInvencible(true);
      setTimeout(() => setEsInvencible(false), DURACION_INVENCIBILIDAD);
    } else {
      setVidas(0);
      setEsFinDeJuego(true);
    }
  };

  // --- Sistemas del Juego (useEffect hooks) ---

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (!esFinDeJuego) {
          posicionInicioArrastre.current = posicionNaveRef.current;
          setEstaDisparando(true);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        if (!esFinDeJuego) {
          const newX = posicionInicioArrastre.current.x + gestureState.dx;
          const newY = posicionInicioArrastre.current.y - gestureState.dy;

          const clampedX = Math.max(50, Math.min(ANCHO_PANTALLA - 50, newX));
          const clampedY = Math.max(50, Math.min(ALTO_PANTALLA - 50, newY));

          setPosicionNave({ x: clampedX, y: clampedY });
        }
      },
      onPanResponderRelease: () => {
        setEstaDisparando(false);
      },
    })
  ).current;

  useEffect(() => {
    if (estadoDeJuego === 'Jugando' && estaDisparando && !esFinDeJuego) {
      const intervaloDisparo = setInterval(() => {
        const posicionActual = posicionNaveRef.current;
        const nuevasBalas: ObjetoDeJuego[] = [];
        if (nivelDisparo === 1) {
          nuevasBalas.push({ id: siguienteIdBala.current++, x: posicionActual.x, y: posicionActual.y + 25 });
        } else if (nivelDisparo === 2) {
          nuevasBalas.push({ id: siguienteIdBala.current++, x: posicionActual.x - 15, y: posicionActual.y + 25 });
          nuevasBalas.push({ id: siguienteIdBala.current++, x: posicionActual.x + 15, y: posicionActual.y + 25 });
        } else if (nivelDisparo >= 3) {
          nuevasBalas.push({ id: siguienteIdBala.current++, x: posicionActual.x, y: posicionActual.y + 25 });
          nuevasBalas.push({ id: siguienteIdBala.current++, x: posicionActual.x - 25, y: posicionActual.y + 25 });
          nuevasBalas.push({ id: siguienteIdBala.current++, x: posicionActual.x + 25, y: posicionActual.y + 25 });
        }
        setBalas(prev => [...prev, ...nuevasBalas]);
      }, CADENCIA_DISPARO);
      return () => clearInterval(intervaloDisparo);
    }
  }, [estadoDeJuego, estaDisparando, esFinDeJuego, nivelDisparo]);

  useEffect(() => {
    if (estadoDeJuego === 'Jugando' && !esFinDeJuego) {
      const intervaloTiempo = setInterval(() => {
        setTiempo(t => {
          const nuevoTiempo = t + 1;
          if (nuevoTiempo > 0 && nuevoTiempo % INTERVALO_AUMENTO_VELOCIDAD === 0) velocidadEnemigoRef.current = Math.min(8, velocidadEnemigoRef.current + 0.25);
          if (nuevoTiempo > 0 && nuevoTiempo % INTERVALO_AUMENTO_FRECUENCIA === 0) frecuenciaAparicionEnemigoRef.current = Math.max(300, frecuenciaAparicionEnemigoRef.current - 100);
          return nuevoTiempo;
        });
      }, 1000);
      return () => clearInterval(intervaloTiempo);
    }
  }, [estadoDeJuego, esFinDeJuego]);

  useEffect(() => {
    if (estadoDeJuego === 'Jugando' && !esFinDeJuego) {
      let temporizadorAparicion: number;
      const aparecer = () => {
        const tiposEnemigo: TipoEnemigo[] = ['default', 'enemigo1', 'enemigo2'];
        const tipoAleatorio = tiposEnemigo[Math.floor(Math.random() * tiposEnemigo.length)];
        let vida = 1;
        let tamanio = TAMANIO_ENEMIGO_DEFAULT;
        if (tipoAleatorio === 'enemigo1') {
          vida = 2;
          tamanio = TAMANIO_ENEMIGO_GRANDE;
        }
        if (tipoAleatorio === 'enemigo2') {
          vida = 3;
          tamanio = TAMANIO_ENEMIGO_GRANDE;
        }

        setEnemigos(prev => (prev.length < MAXIMO_ENEMIGOS) ? [...prev, { id: siguienteIdEnemigo.current++, x: Math.random() * (ANCHO_PANTALLA - tamanio.ancho) + tamanio.ancho / 2, y: -tamanio.alto, tipo: tipoAleatorio, vida: vida }] : prev);
        temporizadorAparicion = setTimeout(aparecer, frecuenciaAparicionEnemigoRef.current);
      };
      aparecer();
      return () => clearTimeout(temporizadorAparicion);
    }
  }, [estadoDeJuego, esFinDeJuego]);

  useEffect(() => {
    if (estadoDeJuego === 'Jugando' && !esFinDeJuego) {
      const intervaloAsteroide = setInterval(() => {
        setAsteroides(prev => [...prev, { id: siguienteIdAsteroide.current++, x: Math.random() * ANCHO_PANTALLA, y: -60 }]);
      }, 5000);
      return () => clearInterval(intervaloAsteroide);
    }
  }, [estadoDeJuego, esFinDeJuego]);

  const enemigosRef = useRef(enemigos);
  useEffect(() => {
    enemigosRef.current = enemigos;
  }, [enemigos]);

  useEffect(() => {
    if (estadoDeJuego === 'Jugando' && !esFinDeJuego) {
      const intervaloDisparoEnemigo = setInterval(() => {
        const nuevasBalasEnemigas: ObjetoDeJuego[] = [];
        enemigosRef.current.forEach(enemigo => {
          if (Math.random() < probDisparoRef.current) {
            const tamanio = (enemigo.tipo === 'enemigo1' || enemigo.tipo === 'enemigo2') ? TAMANIO_ENEMIGO_GRANDE : TAMANIO_ENEMIGO_DEFAULT;
            if (enemigo.tipo === 'enemigo1') {
              nuevasBalasEnemigas.push({ id: siguienteIdBalaEnemiga.current++, x: enemigo.x, y: enemigo.y + tamanio.alto });
            } else if (enemigo.tipo === 'enemigo2') {
              nuevasBalasEnemigas.push({ id: siguienteIdBalaEnemiga.current++, x: enemigo.x - 15, y: enemigo.y + tamanio.alto });
              nuevasBalasEnemigas.push({ id: siguienteIdBalaEnemiga.current++, x: enemigo.x + 15, y: enemigo.y + tamanio.alto });
            }
          }
        });
        if (nuevasBalasEnemigas.length > 0) {
          setBalasEnemigas(prev => [...prev, ...nuevasBalasEnemigas]);
        }
      }, frecDisparoRef.current);
      return () => clearInterval(intervaloDisparoEnemigo);
    }
  }, [estadoDeJuego, esFinDeJuego]);

  useEffect(() => {
    if (esInvencible) {
      const intervaloParpadeo = setInterval(() => setNaveVisible(v => !v), 150);
      return () => { clearInterval(intervaloParpadeo); setNaveVisible(true); };
    }
  }, [esInvencible]);

  useEffect(() => {
    if (esFinDeJuego) {
      setEstaDisparando(false);
      Alert.alert('Fin del Juego', `Puntuación Final: ${puntuacion}\nTiempo: ${formatearTiempo(tiempo)}`, [{ text: 'Reiniciar', onPress: volverAlMenu }]);
    }
  }, [esFinDeJuego, puntuacion, tiempo]);

  useEffect(() => {
    if (estadoDeJuego !== 'Jugando' || esFinDeJuego) {
      return;
    }

    const bucleJuego = () => {
      const velocidadJuego = multiplicadorVelocidadJuegoRef.current;

      // Mover Balas
      setBalas(prev => prev.map(b => ({ ...b, y: b.y + velocidadBalaRef.current * velocidadJuego })).filter(b => b.y < ALTO_PANTALLA));
      setBalasEnemigas(prev => prev.map(b => ({ ...b, y: b.y + velDisparoRef.current * velocidadJuego })).filter(b => b.y < ALTO_PANTALLA));

      // Mover Enemigos
      setEnemigos(prev => prev.map(e => ({ ...e, y: e.y + (e.tipo === 'enemigo1' || e.tipo === 'enemigo2' ? velocidadEnemigoRef.current * 0.4 : velocidadEnemigoRef.current) * velocidadJuego })).filter(e => e.y < ALTO_PANTALLA));

      // Mover Asteroides
      setAsteroides(prev => prev.map(a => ({ ...a, y: a.y + velocidadEnemigoRef.current * velocidadJuego * 0.8 })).filter(a => a.y < ALTO_PANTALLA));

      // Mover Potenciadores
      setPotenciadores(prev => prev.map(p => ({ ...p, y: p.y + 2 * velocidadJuego })).filter(p => p.y < ALTO_PANTALLA));

      // Detectar Colisiones
      const { balasEliminadas, enemigosEliminados, asteroidesEliminados, potenciadoresEliminados, balasEnemigasEliminadas } = detectarColisiones(
        balas,
        enemigos,
        asteroides,
        potenciadores,
        balasEnemigas,
        posicionNave,
        esInvencible,
        manejarGolpeNave,
        setPuntuacion,
        setNivelDisparo,
        nivelDisparo,
        siguienteIdPotenciador,
        setPotenciadores,
        ANCHO_PANTALLA,
        ALTO_PANTALLA
      );

      if (balasEliminadas.size > 0) setBalas(prev => prev.filter(b => !balasEliminadas.has(b.id)));
      if (enemigosEliminados.size > 0) setEnemigos(prev => prev.filter(e => !enemigosEliminados.has(e.id)));
      if (asteroidesEliminados.size > 0) setAsteroides(prev => prev.filter(a => !asteroidesEliminados.has(a.id)));
      if (potenciadoresEliminados.size > 0) setPotenciadores(prev => prev.filter(p => !potenciadoresEliminados.has(p.id)));
      if (balasEnemigasEliminadas.size > 0) setBalasEnemigas(prev => prev.filter(b => !balasEnemigasEliminadas.has(b.id)));

      bucleJuegoRef.current = requestAnimationFrame(bucleJuego);
    };

    bucleJuegoRef.current = requestAnimationFrame(bucleJuego);

    return () => {
      if (bucleJuegoRef.current) {
        cancelAnimationFrame(bucleJuegoRef.current);
      }
    };
  }, [estadoDeJuego, esFinDeJuego, balas, enemigos, asteroides, potenciadores, balasEnemigas, posicionNave, esInvencible, manejarGolpeNave, setPuntuacion, setNivelDisparo, nivelDisparo, siguienteIdPotenciador]);

  return {
    estadoDeJuego,
    esFinDeJuego,
    posicionNave,
    enemigos,
    balas,
    asteroides,
    potenciadores,
    balasEnemigas,
    puntuacion,
    tiempo,
    vidas,
    naveVisible,
    panResponder,
    iniciarJuego,
    comenzarJuego, // Añadido para iniciar el juego desde la pantalla de reglas
    formatearTiempo,
    opcionesJuego,
    actualizarOpciones,
    irAPantallaDeOpciones,
    volverAlMenu,
  };
};
