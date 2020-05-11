var dbservice = require('../service/db.js');
var utils = require('../service/utils');
const url = require('url');

var toRegexIfContainSlash = (k, v) =>{
	if(typeof v !== 'string') return v;
	if(v && v.startsWith('/') && v.endsWith('/')) {
		let r = v.substring(1, v.length-1);
		console.log(`criteria ${k} - extraction REGEX ${r}`);
		return new RegExp(r, 'i');
	} else {
		return v;
	}
};
var processRegex = (cri) => {
	Object.getOwnPropertyNames(cri).map( (k) =>
		cri[k] = toRegexIfContainSlash(k, cri[k])
	);
	
};

module.exports = async (req, res) => {
	
  try {
	  utils.prepareHeader(res);
	  const query = url.parse(req.url,true).query;

	  // Select the users collection from the database
	  const moviesInfo = await findMovies(query);

	
	  // Respond with a JSON string of all users in the collection
	  res.status(200).json({ version : 1.01, ...moviesInfo });
  } catch(e) {
	console.log(e);
    utils.sendError(res, 'Error ' +e);
  }

}

let findMovies = async (query) => {
	
	  console.log('findMovies', query);
      let cri = {};
	  if(query.filter) { 
		  cri = JSON.parse( utils.correctJson(query.filter) ) ; 
	  }
      if(typeof cri !== 'object') {
	      cri = {};
      }
      processRegex(cri);
	  let limit = query.limit? parseInt(query.limit) : 3;

	  // Get a database connection, cached or otherwise,
	  // using the connection string environment variable as the argument
	  const db = await dbservice.connectToDatabase();
	  // Select the "users" collection from the database
	  const cursor = db.collection('movies').find(cri);
	
	  const [count, movies] = await Promise.all([cursor.count(), cursor.limit(limit ).toArray() ] );
	  return {count, movies};
}



// test 
let test = async () => {
	let res = await findMovies({
		filter : `{title:/devil/}`,
		limit : "1"
	});
	console.log( 'test res', res);
	


};

if(process.env.RUN_TEST) {
  test();
}

