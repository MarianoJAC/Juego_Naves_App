
import React from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Image,
} from 'react-native';
import Nave from './components/Nave';
import Enemigo from './components/Enemigo';
import Bala from './components/Bala';
import PantallaOpciones from './components/PantallaOpciones';

import Asteroide from './components/Asteroide';

import Potenciador from './components/Potenciador';
import BalaEnemiga from './components/BalaEnemiga';
import PantallaInstrucciones from './components/PantallaInstrucciones';
import { usarLogicaJuego } from './hooks/usarLogicaJuego';
import { estilosJuego } from './styles/estilosJuego';



export default function App() {
  const {
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
    comenzarJuego, // Añadido para la nueva pantalla de reglas
    formatearTiempo,
    opcionesJuego,
    actualizarOpciones,
    irAPantallaDeOpciones,
    volverAlMenu,
  } = usarLogicaJuego();

  if (estadoDeJuego === 'PantallaDeInicio') {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <ImageBackground source={require('./assets/img/caraturla.jpg')} style={estilosJuego.fondo} resizeMode="contain">
          <View style={estilosJuego.superposicion}>
            <TouchableOpacity style={estilosJuego.botonInicio} onPress={iniciarJuego}>
              <Text style={estilosJuego.textoBotonInicio}>Iniciar Juego</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilosJuego.botonOpciones} onPress={irAPantallaDeOpciones}>
              <Text style={estilosJuego.textoBotonInicio}>Opciones</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }

  if (estadoDeJuego === 'PantallaDeReglas') {
    return <PantallaInstrucciones comenzarJuego={comenzarJuego} />;
  }

  if (estadoDeJuego === 'PantallaDeOpciones') {
    return <PantallaOpciones opciones={opcionesJuego} actualizarOpciones={actualizarOpciones} volverAlMenu={volverAlMenu} />;
  }

  return (
    <View style={estilosJuego.contenedor} {...panResponder.panHandlers}>
      <Image source={require('./assets/img/fondogame.gif')} style={estilosJuego.fondo} />
      <View style={estilosJuego.panelInfo}>
        <Text style={estilosJuego.textoPanelInfo}>Puntuación: {puntuacion}</Text>
        <Text style={estilosJuego.textoPanelInfo}>Vidas: {vidas}</Text>
        <Text style={estilosJuego.textoPanelInfo}>Tiempo: {formatearTiempo(tiempo)}</Text>
      </View>
      {!esFinDeJuego && naveVisible && <Nave x={posicionNave.x} y={posicionNave.y} />}
      {enemigos.map(enemigo => <Enemigo key={enemigo.id} x={enemigo.x} y={enemigo.y} tipo={enemigo.tipo ?? 'default'} />)}
      {balas.map(bala => <Bala key={bala.id} x={bala.x} y={bala.y} />)}
      {balasEnemigas.map(bala => <BalaEnemiga key={bala.id} x={bala.x} y={bala.y} />)}
      {asteroides.map(asteroide => <Asteroide key={asteroide.id} x={asteroide.x} y={asteroide.y} />)}
      {potenciadores.map(potenciador => <Potenciador key={potenciador.id} x={potenciador.x} y={potenciador.y} />)}
      {esFinDeJuego && <View style={estilosJuego.superposicionFinJuego} />}
    </View>
  );
}