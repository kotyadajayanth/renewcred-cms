export default function Heading({ data }) {
  const Tag = `h${data.level || 2}`;
  return <Tag>{data.text}</Tag>;
}
