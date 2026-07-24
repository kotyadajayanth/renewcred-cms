// items can just be strings, or objects with children for nested lists.
// this recurses one level at a time instead of assuming a fixed depth.
function renderItems(items, ordered) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag>
      {items.map((item, i) => {
        if (typeof item === 'string') {
          return <li key={i}>{item}</li>;
        }
        return (
          <li key={i}>
            {item.text}
            {item.children && item.children.length > 0 && renderItems(item.children, ordered)}
          </li>
        );
      })}
    </Tag>
  );
}

export default function ListBlock({ data }) {
  return renderItems(data.items, data.ordered);
}
