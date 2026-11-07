
import { StyleSheet, Dimensions } from 'react-native';

const { width: ANCHO_PANTALLA, height: ALTO_PANTALLA } = Dimensions.get('window');

export const estilosJuego = StyleSheet.create({
  contenedorOpciones: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  tituloOpciones: { color: '#fff', fontSize: 40, fontWeight: 'bold', marginBottom: 40 },
  botonOpcion: { backgroundColor: '#fed83d', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10, marginBottom: 20, width: '80%', alignItems: 'center' },
  textoBotonOpcion: { color: '#000', fontSize: 20, fontWeight: 'bold' },
  botonVolver: { position: 'absolute', bottom: 50, backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10 },
  textoBotonVolver: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  contenedor: { flex: 1 },
  fondo: { width: '100%', height: '100%' },
  panelInfo: { position: 'absolute', top: 50, left: 0, flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 20, zIndex: 10 },
  textoPanelInfo: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  superposicionFinJuego: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  superposicion: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 120 },
  botonInicio: { backgroundColor: '#fed83d', paddingHorizontal: 40, paddingVertical: 20, borderRadius: 10, borderWidth: 2, borderColor: '#fff', marginBottom: 20 },
  botonOpciones: { backgroundColor: '#3d93fe', paddingHorizontal: 40, paddingVertical: 20, borderRadius: 10, borderWidth: 2, borderColor: '#fff' },
  textoBotonInicio: { color: '#000', fontSize: 24, fontWeight: 'bold' },
});
