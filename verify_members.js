const db = require('./database');
const { v4: uuidv4 } = require('uuid');

async function verifyMembers() {
  console.log('Verifying Member API logic...');
  await db.init();

  const testId = uuidv4();
  const testMember = {
    id: testId,
    name: 'Test User',
    email: 'test@example.com',
    role: 'member'
  };

  // Test Create
  await new Promise((resolve, reject) => {
    db.run('INSERT INTO members (id, name, email, role) VALUES (?, ?, ?, ?)', 
      [testMember.id, testMember.name, testMember.email, testMember.role], 
      function(err) {
        if (err) {
          console.error('Create failed:', err.message);
          reject(err);
        } else {
          console.log('Create member: SUCCESS');
          resolve();
        }
      }
    );
  });

  // Test Read
  await new Promise((resolve, reject) => {
    db.get('SELECT * FROM members WHERE id = ?', [testId], (err, row) => {
      if (err || !row || row.name !== testMember.name) {
        console.error('Read failed:', err ? err.message : 'Member not found');
        reject(err || new Error('Member not found'));
      } else {
        console.log('Read member: SUCCESS');
        resolve();
      }
    });
  });

  // Test Update
  await new Promise((resolve, reject) => {
    db.run('UPDATE members SET name = ? WHERE id = ?', ['Updated Name', testId], function(err) {
      if (err || this.changes === 0) {
        console.error('Update failed:', err ? err.message : 'No changes');
        reject(err || new Error('No changes'));
      } else {
        console.log('Update member: SUCCESS');
        resolve();
      }
    });
  });

  // Test Delete
  await new Promise((resolve, reject) => {
    db.run('DELETE FROM members WHERE id = ?', [testId], function(err) {
      if (err || this.changes === 0) {
        console.error('Delete failed:', err ? err.message : 'No changes');
        reject(err || new Error('No changes'));
      } else {
        console.log('Delete member: SUCCESS');
        resolve();
      }
    });
  });

  console.log('All Member API logic verifications PASSED.');
  db.close();
}

verifyMembers().catch(err => {
  console.error('Verification FAILED');
  process.exit(1);
});
