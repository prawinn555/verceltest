module.exports = async (req, res) => {
  console.log('function A');
  try {
    res.send(`function A  v2 !!!!`)
  } catch(e)  {
	console.error(e);
  }
}