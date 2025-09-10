type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

interface JsonNode {
  key?: string;
  value: JsonValue;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  depth: number;
}

function getValueType(value: JsonValue): JsonNode['type'] {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'null';
}

let lineCounter = 1;

function formatPrimitive(value: JsonValue, type: JsonNode['type']): string {
  switch (type) {
    case 'boolean':
      return `<span class="text-cyan-500">${String(value)}</span>`;
    case 'null':
      return `<span class="text-rose-500">null</span>`;
    case 'number':
      return `<span class="text-amber-500">${String(value)}</span>`;
    case 'string':
      return `<span class="text-emerald-500">"${String(value)}"</span>`;
    default:
      return String(value);
  }
}

function createExpanderHtml(depth: number, isExpanded: boolean = true): string {
  const icon = isExpanded ? 'chevron-down' : 'chevron-right';
  return `<button class="expander" data-depth="${depth}" tabindex="0" role="treeitem" aria-expanded="${isExpanded}">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide ${icon}">
      <polyline points="${isExpanded ? '6 9 12 15 18 9' : '9 18 15 12 9 6'}" />
    </svg>
  </button>`;
}

function getIndentation(depth: number): string {
  return '  '.repeat(depth);
}

function getNextLineNumber(depth: number): string {
  return depth === 0 ? `<span class="line-number">${lineCounter++}</span>` : '';
}

function processPrimitive(node: JsonNode, isLast: boolean): string {
  const { key, value, type, depth } = node;
  const indentation = getIndentation(depth);
  let line = indentation;

  if (key !== undefined) {
    line += `<span class="text-violet-500">"${key}"</span>: `;
  }

  line += formatPrimitive(value, type);
  if (!isLast) line += ',';

  return `<div class="line" role="treeitem">${getNextLineNumber(depth)}${line}</div>`;
}

function processCompound(node: JsonNode, isLast: boolean): string {
  const { key, value, type, depth } = node;
  const indentation = getIndentation(depth);
  let line = indentation;

  const isObject = type === 'object';
  const bracketValue = isObject ? value as JsonObject : value as JsonArray;
  const isEmpty = isObject 
    ? Object.keys(bracketValue || {}).length === 0 
    : (bracketValue || []).length === 0;
  const openBracket = isObject ? '{' : '[';
  const closeBracket = isObject ? '}' : ']';

  if (key !== undefined) {
    line += `<span class="text-violet-500">"${key}"</span>: `;
  }

  if (isEmpty) {
    line += `${openBracket}${closeBracket}${isLast ? '' : ','}`;
    return `<div class="line" role="treeitem">${getNextLineNumber(depth)}${line}</div>`;
  }

  const expanderHtml = createExpanderHtml(depth);
  line = `<div class="line expandable" role="treeitem" aria-expanded="true">${getNextLineNumber(depth)}${expanderHtml}${line}${openBracket}</div>`;

  let childrenHtml = '';
  if (isObject && bracketValue) {
    const entries = Object.entries(bracketValue);
    childrenHtml = entries.map(([childKey, childValue], index) => {
      return processNode({
        key: childKey,
        value: childValue,
        type: getValueType(childValue),
        depth: depth + 1
      }, index === entries.length - 1);
    }).join('');
  } else if (Array.isArray(bracketValue)) {
    childrenHtml = bracketValue.map((item, index) => {
      return processNode({
        value: item,
        type: getValueType(item),
        depth: depth + 1
      }, index === bracketValue.length - 1);
    }).join('');
  }

  return line + 
         `<div class="content" role="group" data-depth="${depth}">${childrenHtml}</div>` +
         `<div class="line" role="treeitem">${getNextLineNumber(depth)}${indentation}${closeBracket}${isLast ? '' : ','}</div>`;
}

function processNode(node: JsonNode, isLast: boolean): string {
  return node.type === 'object' || node.type === 'array'
    ? processCompound(node, isLast)
    : processPrimitive(node, isLast);
}

export function syntaxHighlight(json: string): string {
  if (typeof json !== 'string') {
    return String(json);
  }

  try {
    const obj = JSON.parse(json);
    lineCounter = 1; // Reset line counter for each new formatting
    const rootNode: JsonNode = {
      value: obj,
      type: getValueType(obj),
      depth: 0
    };

    return `<div class="json-viewer" role="tree" aria-label="JSON Response">
      ${processNode(rootNode, true)}
    </div>`;
  } catch {
    // If the input is not valid JSON, return it escaped but unformatted
    return json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

export function isJsonString(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}


