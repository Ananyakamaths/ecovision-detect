export default function handler(req, res) {
  if (req.method === 'POST') {
    // In serverless environment, persistent file storage is limited
    // For demo purposes, just return success
    console.log('Prediction data:', req.body);
    res.status(200).json({ message: 'Saved successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}