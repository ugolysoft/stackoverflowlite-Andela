const error = (error)=>{
	console.log(error);
	res.send({
		success: false,
		message: 'Operation failed. try again later. ' 
	});
}

module.exports = {
	error
}