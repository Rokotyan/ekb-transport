export const palette = [
  '#FC6453', '#82C12F', '#9068BE', '#FEDA6A', '#00bde7', '#bd0026', '#31708f',
  '#ff5578', '#6a4c93', '#ff7f3a', '#FFFF00', '#1CE6FF', '#FF34FF', '#FF4A46',
  '#008941', '#006FA6', '#FFDBE5', '#7A4900', '#C8D0F6', '#F4D749', '#0086ED',
  '#04F757', '#809693', '#FEFFE6', '#4FC601', '#3B5DFF', '#FF2F80', '#61615A',
  '#BA0900', '#6B7900', '#00C2A0', '#FFAA92', '#FF90C9', '#B903AA', '#D16100',
  '#DDEFFF', '#7B4F4B', '#A1C299', '#0AA6D8', '#00846F'];

export function getColor(d) {
  if (isFinite(d)) return palette[d % palette.length];
  if (d.color) return d.color;

  return '#666';
}
