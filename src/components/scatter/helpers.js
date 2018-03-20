export function getId(str) {
  return str.toLowerCase().replace(/\s/g, '-');
}

export function getTooltipContent(d) {
  const value = d;
  const title = 'Sample Title';
  const description = 'Sample Description';
  return `<span>
    <div style="min-width: 200px">${title}: ${description}</div>
    <div><b>${value}</b></div>
  </span>`;
}
