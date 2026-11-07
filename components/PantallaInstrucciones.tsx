import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { estilosJuego } from '../styles/estilosJuego';

interface PantallaReglasProps {
  comenzarJuego: () => void;
}

const PantallaReglas: React.FC<PantallaReglasProps> = ({ comenzarJuego }) => {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Instrucciones</Text>
      <View style={styles.reglasContenedor}>
        <Text style={styles.texto}>- Modo de juego Infinito.</Text>
        <Text style={styles.texto}>- Mueve la nave arrastrando el dedo por la pantalla.</Text>
        <Text style={styles.texto}>- La nave disparará automáticamente mientras la mueves.</Text>
        <Text style={styles.texto}>- Destruye a los enemigos para sumar puntos.</Text>
        <Text style={styles.texto}>- Evita que los enemigos y sus disparos te alcancen.</Text>
        <Text style={styles.texto}>- Recoge potenciadores para mejorar tu disparo hasta nivel 3.</Text>
        <Text style={styles.texto}>- Cada 1000 puntos sumas 1 vida.</Text>
      </View>
      <Text style={styles.subtitulo}>Puntuación</Text>
      <View style={styles.reglasContenedor}>
        <Text style={styles.texto}>- Enemigo normal: 10 puntos.</Text>
        <Text style={styles.texto}>- Potenciadores con disparo al máximo: 50 puntos.</Text>
      </View>
      <TouchableOpacity style={estilosJuego.botonInicio} onPress={comenzarJuego}>
        <Text style={estilosJuego.textoBotonInicio}>Comenzar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  reglasContenedor: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 24,
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  texto: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 10,
  },
});

export default PantallaReglas;