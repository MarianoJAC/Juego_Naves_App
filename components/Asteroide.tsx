
import React from 'react';
import { StyleSheet, Image } from 'react-native';

export const ASTEROIDE_ANCHO = 60;
export const ASTEROIDE_ALTO = 60;

interface AsteroideProps {
  x: number;
  y: number;
}

const Asteroide: React.FC<AsteroideProps> = ({ x, y }) => {
  return (
    <Image
      source={require('../assets/img/asteroide.png')}
      style={[styles.asteroide, { left: x - ASTEROIDE_ANCHO / 2, top: y }]}
    />
  );
};

const styles = StyleSheet.create({
  asteroide: {
    position: 'absolute',
    width: ASTEROIDE_ANCHO,
    height: ASTEROIDE_ALTO,
  },
});

export default Asteroide;
