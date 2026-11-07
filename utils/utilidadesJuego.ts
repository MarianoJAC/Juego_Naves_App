
export const formatearTiempo = (segundos: number) => {
  const minutos = Math.floor(segundos / 60).toString().padStart(2, '0');
  const segs = (segundos % 60).toString().padStart(2, '0');
  return `${minutos}:${segs}`;
};
