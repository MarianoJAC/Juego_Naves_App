
import React from 'react';
import { StyleSheet, Image } from 'react-native';

export const NAVE_ANCHO = 100;
export const NAVE_ALTO = 100;

interface NaveProps {
  x: number;
  y: number;
}

const Nave: React.FC<NaveProps> = ({ x, y }) => {
  return (
    <Image
      source={require('../assets/img/nave.png')}
      style={[
        styles.nave,
        {
          left: x - NAVE_ANCHO / 2,
          bottom: y,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  nave: {
    position: 'absolute',
    width: NAVE_ANCHO,
    height: NAVE_ALTO,
  },
});

export default Nave;
