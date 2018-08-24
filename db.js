
const pg = require('pg');
const con = process.env.DATABASE_URL || 'postgresql://postgres:ugowoo@localhost:3500/stackoverflowlite';
const client = new pg.Client(con);
client.connect();

function runQuery(querystring,data = []){
	return client.query(querystring, data)
	.then((res)=> {
		var cmd = querystring.split(' ')[0].toLowerCase();
		if(cmd == 'select'){
			return res.rows;
		}
	})
	
}
module.exports = {
	runQuery
};
