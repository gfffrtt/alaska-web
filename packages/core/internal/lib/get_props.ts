export const getProps = <T>(id: string): T =>
  JSON.parse(document.getElementById(id).textContent);
