
import React from 'react';
import { StyleSheet, Image } from 'react-native';

export const POTENCIADOR_ANCHO = 30;
export const POTENCIADOR_ALTO = 30;

interface PotenciadorProps {
  x: number;
  y: number;
}

const Potenciador: React.FC<PotenciadorProps> = ({ x, y }) => {
  return (
    <Image
      source={require('../assets/img/potenciador.png')}
      style={[styles.potenciador, { left: x - POTENCIADOR_ANCHO / 2, top: y }]}
    />
  );
};

const styles = StyleSheet.create({
  potenciador: {
    position: 'absolute',
    width: POTENCIADOR_ANCHO,
    height: POTENCIADOR_ALTO,
  },
});

export default Potenciador;
