export function addFont(url) {
  const link = document.createElement('link');
  link.setAttribute('href', url);
  link.setAttribute('rel', 'stylesheet');
  document.head.appendChild(link);
}

export function ordinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + ( s[(v - 20) % 10] || s[v] || s[0] );
}

export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function stripHtml(str) {
  return str.replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/g, ' ').trim();
}

export function removeNewLineCharacters(str) {
  return str.replace(/(\r|\n)/g, ' ');
}

export function isNumeric(d) {
  return typeof d === 'number' || d === null;
}

export function htmlToText(str) {
  const s = stripHtml( (removeNewLineCharacters(str || '')).split('</p>').join('\n') ).trim();
  return s;
}
