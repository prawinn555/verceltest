module.exports = async (req, res) => {
  
  console.log('call index');
  try {
    var utils = require('../service/utils');
    res.send(`${utils.serviceListHTML()}`);
  } catch(e)  {
	console.error(e);
	res.send('ERR '+e);
  }
}