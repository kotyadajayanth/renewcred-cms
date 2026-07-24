import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import AdminLayout from '../../components/admin/AdminLayout';
import { useGetAllContentQuery, useDeleteContentMutation } from '../../store/contentApi';

export default function Dashboard() {
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) router.replace('/admin/login');
  }, [token, router]);

  const { data: sections, isLoading } = useGetAllContentQuery(undefined, { skip: !token });
  const [deleteContent] = useDeleteContentMutation();

  if (!token) return null;
  if (isLoading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  async function handleDelete(id) {
    if (confirm('Delete this section?')) {
      await deleteContent(id);
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Content sections</h1>
        <Link href="/admin/content/new">
          <button>+ New section</button>
        </Link>
      </div>

      <table style={{ width: '100%', background: 'white', marginTop: 16 }}>
        <thead>
          <tr>
            <th>Page</th>
            <th>Section</th>
            <th>Title</th>
            <th>Blocks</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s) => (
            <tr key={s._id}>
              <td>{s.page}</td>
              <td>{s.section}</td>
              <td>{s.title}</td>
              <td>{s.blocks.length}</td>
              <td>
                <Link href={`/admin/content/${s._id}`}>Edit</Link>{' '}
                <button onClick={() => handleDelete(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
