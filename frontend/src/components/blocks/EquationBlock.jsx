import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// storing raw latex string and letting katex render it client side means the
// admin just types the formula, no need to build a custom equation editor.
export default function EquationBlock({ data }) {
  return <BlockMath math={data.latex} />;
}
