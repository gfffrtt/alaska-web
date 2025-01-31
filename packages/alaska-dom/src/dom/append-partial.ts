export const appendPartial = (node: Node) => {
  if (node instanceof HTMLTemplateElement) {
    document.body.appendChild(node);
  } else if (node instanceof HTMLScriptElement) {
    const script = document.createElement("script");
    script.text = node.text;
    document.body.appendChild(script);
  }
};
