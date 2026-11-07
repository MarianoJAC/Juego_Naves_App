
import React from 'react';
import { View, StyleSheet } from 'react-native';

export const BALA_ANCHO = 5;
export const BALA_ALTO = 15;

interface BalaProps {
  x: number;
  y: number;
}

const Bala: React.FC<BalaProps> = ({ x, y }) => {
  return <View style={[styles.bala, { left: x - BALA_ANCHO / 2, bottom: y }]} />;
};

const styles = StyleSheet.create({
  bala: {
    position: 'absolute',
    width: BALA_ANCHO,
    height: BALA_ALTO,
    backgroundColor: 'yellow',
    borderRadius: 2.5,
  },
});

export default Bala;
