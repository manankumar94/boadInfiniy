require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const { authenticateToken } = require('./middlewares/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');


const app = express();
const port = process.env.PORT || 5000;


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, 
});


sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/users', authenticateToken, userRoutes);
app.use('/projects', authenticateToken, projectRoutes);
app.use('/audit-logs', authenticateToken, auditLogRoutes);


app.get('/', (req, res) => {
  res.send('Admin Panel API is up and running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
