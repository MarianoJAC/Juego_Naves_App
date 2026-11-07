
import React from 'react';
import { StyleSheet, Image } from 'react-native';

export const TAMANIO_ENEMIGO_DEFAULT = { ancho: 50, alto: 50 };
export const TAMANIO_ENEMIGO_GRANDE = { ancho: 100, alto: 100 };

const IMAGENES_ENEMIGOS = {
  default: require('../assets/img/asteroide.png'),
  enemigo1: require('../assets/img/naveenemiga1.png'),
  enemigo2: require('../assets/img/naveenemiga2.png'),
};

import { TipoEnemigo } from '../types/tiposJuego';

interface EnemigoProps {
  x: number;
  y: number;
  tipo: TipoEnemigo;
}

const getTamanioEnemigo = (tipo: TipoEnemigo) => {
  if (tipo === 'enemigo1' || tipo === 'enemigo2') {
    return TAMANIO_ENEMIGO_GRANDE;
  }
  return TAMANIO_ENEMIGO_DEFAULT;
};

const Enemigo: React.FC<EnemigoProps> = ({ x, y, tipo }) => {
  const imagen = IMAGENES_ENEMIGOS[tipo] || IMAGENES_ENEMIGOS.default;
  const { ancho, alto } = getTamanioEnemigo(tipo);

  return (
    <Image
      source={imagen}
      style={[styles.enemigo, { left: x - ancho / 2, top: y, width: ancho, height: alto }]}
    />
  );
};

const styles = StyleSheet.create({
  enemigo: {
    position: 'absolute',
  },
});

export default Enemigo;
