
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { OpcionesJuego, Dificultad, VelocidadJuego } from '../types/tiposJuego';
import { estilosJuego } from '../styles/estilosJuego';

interface PantallaOpcionesProps {
  opciones: OpcionesJuego;
  actualizarOpciones: (opciones: Partial<OpcionesJuego>) => void;
  volverAlMenu: () => void;
}

const PantallaOpciones: React.FC<PantallaOpcionesProps> = ({ opciones, actualizarOpciones, volverAlMenu }) => {
  const { vidas, dificultad, velocidad } = opciones;

  const cambiarVidas = () => {
    const opcionesVidas = [1, 3, 5];
    const currentIndex = opcionesVidas.indexOf(vidas);
    const nextIndex = (currentIndex + 1) % opcionesVidas.length;
    actualizarOpciones({ vidas: opcionesVidas[nextIndex] });
  };

  const cambiarDificultad = () => {
    const proximasDificultades: Record<Dificultad, Dificultad> = {
      'Facil': 'Medio',
      'Medio': 'Dificil',
      'Dificil': 'Facil',
    };
    actualizarOpciones({ dificultad: proximasDificultades[dificultad] });
  };

  const cambiarVelocidad = () => {
    const proximasVelocidades: Record<VelocidadJuego, VelocidadJuego> = {
      'Normal': 'Rapida',
      'Rapida': 'UltraRapida',
      'UltraRapida': 'Normal',
    };
    actualizarOpciones({ velocidad: proximasVelocidades[velocidad] });
  };

  return (
    <View style={estilosJuego.contenedorOpciones}>
      <Text style={estilosJuego.tituloOpciones}>Opciones</Text>

      <TouchableOpacity style={estilosJuego.botonOpcion} onPress={cambiarVidas}>
        <Text style={estilosJuego.textoBotonOpcion}>Vidas: {vidas}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={estilosJuego.botonOpcion} onPress={cambiarDificultad}>
        <Text style={estilosJuego.textoBotonOpcion}>Dificultad: {dificultad}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={estilosJuego.botonOpcion} onPress={cambiarVelocidad}>
        <Text style={estilosJuego.textoBotonOpcion}>Velocidad: {velocidad}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={estilosJuego.botonVolver} onPress={volverAlMenu}>
        <Text style={estilosJuego.textoBotonVolver}>Volver al Menú</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PantallaOpciones;
