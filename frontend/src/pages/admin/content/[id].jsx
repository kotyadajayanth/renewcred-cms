import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import AdminLayout from '../../../components/admin/AdminLayout';
import BlockRenderer from '../../../components/blocks/BlockRenderer';
import {
  useGetContentByIdQuery,
  useCreateContentMutation,
  useUpdateContentMutation
} from '../../../store/contentApi';

const emptyBlocks = [{ type: 'paragraph', data: { text: 'New paragraph...' } }];

export default function ContentEditor() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === 'new';
  const token = useSelector((state) => state.auth.token);

  const { data: existing } = useGetContentByIdQuery(id, { skip: !id || isNew || !token });
  const [createContent] = useCreateContentMutation();
  const [updateContent] = useUpdateContentMutation();

  const [page, setPage] = useState('');
  const [section, setSection] = useState('');
  const [title, setTitle] = useState('');
  const [blocksText, setBlocksText] = useState(JSON.stringify(emptyBlocks, null, 2));
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    if (!token) router.replace('/admin/login');
  }, [token, router]);

  useEffect(() => {
    if (existing) {
      setPage(existing.page);
      setSection(existing.section);
      setTitle(existing.title || '');
      setBlocksText(JSON.stringify(existing.blocks, null, 2));
    }
  }, [existing]);

  // blocks are edited as raw JSON rather than a drag-and-drop editor. building a
  // full visual block editor (think Notion) is a multi-week project on its own -
  // for this assignment the JSON editor with a live preview gives admins full
  // control over every block type without me having to hand-build a UI for each
  // one individually. this is the kind of thing I'd revisit first if this went
  // into real production use.
  let previewBlocks = [];
  try {
    previewBlocks = JSON.parse(blocksText);
    if (jsonError) setJsonError('');
  } catch (e) {
    if (!jsonError) setJsonError('blocks is not valid JSON, fix it before saving');
  }

  async function handleSave() {
    if (jsonError) return;

    const payload = { page, section, title, blocks: previewBlocks };

    if (isNew) {
      const created = await createContent(payload).unwrap();
      router.push(`/admin/content/${created._id}`);
    } else {
      await updateContent({ id, ...payload }).unwrap();
      router.push('/admin/dashboard');
    }
  }

  if (!token) return null;

  return (
    <AdminLayout>
      <h1>{isNew ? 'New section' : 'Edit section'}</h1>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <label>Page</label>
          <input value={page} onChange={(e) => setPage(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12 }} />

          <label>Section</label>
          <input value={section} onChange={(e) => setSection(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12 }} />

          <label>Title (internal, for the dashboard list)</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12 }} />

          <label>Blocks (JSON)</label>
          <textarea
            value={blocksText}
            onChange={(e) => setBlocksText(e.target.value)}
            rows={16}
            style={{ width: '100%', fontFamily: 'monospace', padding: 8 }}
          />
          {jsonError && <p style={{ color: 'red' }}>{jsonError}</p>}

          <button onClick={handleSave} disabled={!!jsonError} style={{ marginTop: 12, padding: '8px 16px' }}>
            Save
          </button>
        </div>

        <div style={{ flex: 1, minWidth: 300, background: 'white', padding: 16 }}>
          <p><strong>Live preview</strong></p>
          {!jsonError && <BlockRenderer blocks={previewBlocks} />}
        </div>
      </div>
    </AdminLayout>
  );
}
