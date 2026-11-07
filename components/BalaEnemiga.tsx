
import React from 'react';
import { StyleSheet, Image } from 'react-native';

export const BALA_ENEMIGA_ANCHO = 5;
export const BALA_ENEMIGA_ALTO = 20;

interface BalaEnemigaProps {
  x: number;
  y: number;
}

const BalaEnemiga: React.FC<BalaEnemigaProps> = ({ x, y }) => {
  return (
    <Image
      source={require('../assets/img/balaenemiga.png')}
      style={[styles.bala, { left: x - BALA_ENEMIGA_ANCHO / 2, top: y }]}
    />
  );
};

const styles = StyleSheet.create({
  bala: {
    position: 'absolute',
    width: BALA_ENEMIGA_ANCHO,
    height: BALA_ENEMIGA_ALTO,
  },
});

export default BalaEnemiga;
