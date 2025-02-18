export const appendContent = (contet: Node, node: Node) => {
  if (node instanceof HTMLScriptElement) {
    const script = document.createElement("script");
    script.text = node.text;
    contet.appendChild(script);
    return;
  }
  contet.appendChild(node);
};
