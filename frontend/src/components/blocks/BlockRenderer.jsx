import Heading from './Heading';
import Paragraph from './Paragraph';
import ListBlock from './ListBlock';
import TableBlock from './TableBlock';
import EquationBlock from './EquationBlock';

// each content section is just an array of blocks, and every block knows its
// own "type". this component's only job is picking the right renderer for
// that type. adding a new content type later (e.g. "image") means adding one
// case here and one new component - nothing else in the app has to change.
export default function BlockRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return <Heading key={i} data={block.data} />;
          case 'paragraph':
            return <Paragraph key={i} data={block.data} />;
          case 'list':
            return <ListBlock key={i} data={block.data} />;
          case 'table':
            return <TableBlock key={i} data={block.data} />;
          case 'equation':
            return <EquationBlock key={i} data={block.data} />;
          default:
            return null;
        }
      })}
    </>
  );
}
