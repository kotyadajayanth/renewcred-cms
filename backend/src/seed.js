require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Content = require('./models/Content');

async function seed() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@renewcred.com';
  const plainPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ email });
  if (!existing) {
    const hashed = await bcrypt.hash(plainPassword, 10);
    await User.create({ email, password: hashed, role: 'admin' });
    console.log(`admin created: ${email} / ${plainPassword}`);
  } else {
    console.log('admin already exists, skipping');
  }

  await Content.deleteMany({});

  await Content.create([
    {
      page: 'home',
      section: 'hero',
      title: 'Hero',
      order: 0,
      blocks: [
        { type: 'heading', data: { level: 1, text: 'Renewable energy financing, simplified' } },
        { type: 'paragraph', data: { text: 'RenewCred helps homeowners fund solar installations without the paperwork headache.' } }
      ]
    },
    {
      page: 'home',
      section: 'how-it-works',
      title: 'How it works',
      order: 1,
      blocks: [
        { type: 'heading', data: { level: 2, text: 'How it works' } },
        {
          type: 'list',
          data: {
            ordered: true,
            items: [
              'Apply for pre-approval in 5 minutes',
              {
                text: 'Choose your installer',
                children: ['Compare quotes', 'Check reviews']
              },
              'Get funded and go solar'
            ]
          }
        }
      ]
    },
    {
      page: 'home',
      section: 'pricing',
      title: 'Pricing table',
      order: 2,
      blocks: [
        { type: 'heading', data: { level: 2, text: 'Loan terms' } },
        {
          type: 'table',
          data: {
            headers: ['Term', 'APR', 'Monthly (est.)'],
            rows: [
              ['5 years', '4.9%', '$189'],
              ['10 years', '5.4%', '$107'],
              ['15 years', '5.9%', '$84']
            ]
          }
        },
        {
          type: 'equation',
          data: { latex: 'M = P \\frac{r(1+r)^n}{(1+r)^n - 1}' }
        }
      ]
    }
  ]);

  console.log('sample content seeded');
  process.exit(0);
}

seed();
