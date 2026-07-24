import BlockRenderer from '../components/blocks/BlockRenderer';

export default function Home({ sections }) {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      {sections.map((section) => (
        <section key={section._id} style={{ marginBottom: 40 }}>
          <BlockRenderer blocks={section.blocks} />
        </section>
      ))}
    </main>
  );
}

export async function getServerSideProps() {
  const apiUrl = process.env.BACKEND_INTERNAL_URL || 'http://localhost:5000/api';
  const res = await fetch(`${apiUrl}/content/public/home`);
  const sections = await res.json();

  return { props: { sections } };
}
